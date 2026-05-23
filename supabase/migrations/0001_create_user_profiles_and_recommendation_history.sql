-- 0001_create_user_profiles_and_recommendation_history.sql
-- Purpose: create anonymous user profile and recommendation history tables.
-- Notes:
--   - Idempotent migration (safe to run multiple times).
--   - Includes updated_at trigger for all created tables.
--   - Uses RLS with permissive policies for unauthenticated landing usage.

BEGIN;

DO $$
BEGIN
  -- Required for gen_random_uuid().
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  -- Shared trigger function for updated_at columns.
  CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $fn$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $fn$;

  CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY,
    username text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    last_seen_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS username text;

  CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username
    ON public.user_profiles(username);

  CREATE TABLE IF NOT EXISTS public.recommendation_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recommended_type text NOT NULL,
    recommended_grapes text[] NOT NULL DEFAULT '{}',
    score_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_recommendation_history_user_created_at
    ON public.recommendation_history(user_id, created_at DESC);

  -- Ensure updated_at is maintained automatically.
  DROP TRIGGER IF EXISTS trg_user_profiles_set_updated_at ON public.user_profiles;
  CREATE TRIGGER trg_user_profiles_set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

  DROP TRIGGER IF EXISTS trg_recommendation_history_set_updated_at ON public.recommendation_history;
  CREATE TRIGGER trg_recommendation_history_set_updated_at
  BEFORE UPDATE ON public.recommendation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

  -- RLS setup for client-side access without authentication.
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.recommendation_history ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS user_profiles_public_read_write ON public.user_profiles;
  CREATE POLICY user_profiles_public_read_write
    ON public.user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

  DROP POLICY IF EXISTS recommendation_history_public_read_write ON public.recommendation_history;
  CREATE POLICY recommendation_history_public_read_write
    ON public.recommendation_history
    FOR ALL
    USING (true)
    WITH CHECK (true);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration 0001_create_user_profiles_and_recommendation_history failed: %', SQLERRM;
END;
$$;

COMMIT;
