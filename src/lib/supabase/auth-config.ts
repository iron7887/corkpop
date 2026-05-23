export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

export const getSupabasePublicEnv = (): SupabasePublicEnv | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};

export const getSupabaseUrl = () => {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  return env.url;
};

export const getSupabaseAnonKey = () => {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not set',
    );
  }

  return env.anonKey;
};

export const sanitizeAuthNextPath = (nextPath: string | null) => {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/signup/complete';
  }

  return nextPath;
};
