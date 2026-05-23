import { getAuthSession } from '@/lib/auth-session';
import { z } from 'zod';

const userIdSchema = z.string().uuid();

export const resolveRecommendationUserId = async (anonId: string | null) => {
  const session = await getAuthSession();

  if (session?.user?.id) {
    const parsedSessionId = userIdSchema.safeParse(session.user.id);
    if (parsedSessionId.success) {
      return { userId: parsedSessionId.data, source: 'session' as const };
    }
  }

  const parsedAnonId = userIdSchema.safeParse(anonId);
  if (!parsedAnonId.success) {
    return { error: 'anonId is required' as const };
  }

  return { userId: parsedAnonId.data, source: 'anon' as const };
};
