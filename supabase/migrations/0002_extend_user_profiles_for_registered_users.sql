-- 0002_extend_user_profiles_for_registered_users.sql
-- Purpose: support registered users (Supabase Auth) alongside anonymous profiles.
-- Notes: idempotent migration with updated_at trigger preserved.

BEGIN;

DO $$
BEGIN
  ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS email text;

  ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS user_type text NOT NULL DEFAULT 'anonymous';

  ALTER TABLE public.user_profiles
    DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;

  ALTER TABLE public.user_profiles
    ADD CONSTRAINT user_profiles_user_type_check
    CHECK (user_type IN ('anonymous', 'registered'));

  CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email_registered
    ON public.user_profiles (lower(email))
    WHERE email IS NOT NULL AND user_type = 'registered';

  CREATE OR REPLACE FUNCTION public.is_nickname_available(candidate text)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $fn$
    SELECT NOT EXISTS (
      SELECT 1
      FROM public.user_profiles
      WHERE lower(username) = lower(candidate)
    );
  $fn$;

  CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $trigger$
  DECLARE
    nickname text;
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

    RETURN NEW;
  END;
  $trigger$;

  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user();

  DROP POLICY IF EXISTS user_profiles_public_read_write ON public.user_profiles;

  DROP POLICY IF EXISTS user_profiles_anonymous_all ON public.user_profiles;
  CREATE POLICY user_profiles_anonymous_all
    ON public.user_profiles
    FOR ALL
    USING (user_type = 'anonymous')
    WITH CHECK (user_type = 'anonymous');

  DROP POLICY IF EXISTS user_profiles_registered_select_own ON public.user_profiles;
  CREATE POLICY user_profiles_registered_select_own
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (user_type = 'registered' AND auth.uid() = id);

  DROP POLICY IF EXISTS user_profiles_registered_update_own ON public.user_profiles;
  CREATE POLICY user_profiles_registered_update_own
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (user_type = 'registered' AND auth.uid() = id)
    WITH CHECK (user_type = 'registered' AND auth.uid() = id);

  GRANT EXECUTE ON FUNCTION public.is_nickname_available(text) TO anon, authenticated, service_role;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration 0002_extend_user_profiles_for_registered_users failed: %', SQLERRM;
END;
$$;

COMMIT;
