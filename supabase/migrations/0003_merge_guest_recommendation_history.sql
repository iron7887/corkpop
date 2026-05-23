-- 0003_merge_guest_recommendation_history.sql
-- Purpose: merge anonymous guest recommendation history into a registered user on signup.

BEGIN;

DO $$
BEGIN
  CREATE OR REPLACE FUNCTION public.merge_guest_recommendation_history(
    guest_user_id uuid,
    registered_user_id uuid
  )
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $merge$
  BEGIN
    IF guest_user_id IS NULL OR registered_user_id IS NULL THEN
      RETURN;
    END IF;

    IF guest_user_id = registered_user_id THEN
      RETURN;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.user_profiles
      WHERE id = guest_user_id AND user_type = 'anonymous'
    ) THEN
      RETURN;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.user_profiles
      WHERE id = registered_user_id AND user_type = 'registered'
    ) THEN
      RETURN;
    END IF;

    UPDATE public.recommendation_history
    SET user_id = registered_user_id
    WHERE user_id = guest_user_id;

    DELETE FROM public.user_profiles
    WHERE id = guest_user_id AND user_type = 'anonymous';
  END;
  $merge$;

  CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $trigger$
  DECLARE
    nickname text;
    guest_user_id uuid;
  BEGIN
    nickname := trim(COALESCE(NEW.raw_user_meta_data->>'nickname', ''));

    IF nickname = '' THEN
      RAISE EXCEPTION 'nickname is required';
    END IF;

    IF nickname !~ '^[가-힣a-zA-Z0-9]{2,20}$' THEN
      RAISE EXCEPTION 'invalid nickname format';
    END IF;

    IF NOT public.is_nickname_available(nickname) THEN
      RAISE EXCEPTION 'nickname already taken';
    END IF;

    INSERT INTO public.user_profiles (id, username, email, user_type, last_seen_at)
    VALUES (NEW.id, nickname, NEW.email, 'registered', now())
    ON CONFLICT (id) DO UPDATE
      SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        user_type = 'registered',
        last_seen_at = now(),
        updated_at = now();

    guest_user_id := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'anon_id', '')), '')::uuid;

    IF guest_user_id IS NOT NULL THEN
      PERFORM public.merge_guest_recommendation_history(guest_user_id, NEW.id);
    END IF;

    RETURN NEW;
  END;
  $trigger$;

  GRANT EXECUTE ON FUNCTION public.merge_guest_recommendation_history(uuid, uuid)
    TO anon, authenticated, service_role;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration 0003_merge_guest_recommendation_history failed: %', SQLERRM;
END;
$$;

COMMIT;
