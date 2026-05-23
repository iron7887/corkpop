-- 0003_add_is_email_available_function.sql
-- Purpose: check email duplication for signup (auth.users + registered profiles).

BEGIN;

DO $$
BEGIN
  CREATE OR REPLACE FUNCTION public.is_email_available(candidate text)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public, auth
  AS $fn$
    SELECT NOT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE lower(email) = lower(trim(candidate))
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.user_profiles
      WHERE lower(email) = lower(trim(candidate))
        AND user_type = 'registered'
    );
  $fn$;

  GRANT EXECUTE ON FUNCTION public.is_email_available(text) TO anon, authenticated, service_role;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration 0003_add_is_email_available_function failed: %', SQLERRM;
END;
$$;

COMMIT;
