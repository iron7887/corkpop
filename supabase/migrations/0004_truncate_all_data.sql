-- 0004_truncate_all_data.sql
-- Purpose: delete all application and auth user data (schema preserved).
-- WARNING: destructive operation. Run only in dev/staging or when a full reset is intended.
-- Notes:
--   - Idempotent (safe to run on an already-empty database).
--   - Does not drop tables, functions, triggers, or RLS policies.
--   - public tables must be truncated together with CASCADE (FK: recommendation_history -> user_profiles).

BEGIN;

DO $$
BEGIN
  TRUNCATE TABLE public.recommendation_history, public.user_profiles CASCADE;

  DELETE FROM auth.users;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration 0004_truncate_all_data failed: %', SQLERRM;
END;
$$;

COMMIT;
