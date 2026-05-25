import { getAuthSession } from '@/lib/auth-session';
import { z } from 'zod';

const userIdSchema = z.string().uuid();

export const resolveRecommendationUserId = async () => {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { error: 'unauthorized' as const };
  }

  const parsedSessionId = userIdSchema.safeParse(session.user.id);
  if (!parsedSessionId.success) {
    return { error: 'unauthorized' as const };
  }

  return { userId: parsedSessionId.data };
};
