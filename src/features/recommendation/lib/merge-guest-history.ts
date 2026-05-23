import type { createPureClient } from '@/lib/supabase/server';
import { z } from 'zod';

const anonIdSchema = z.string().uuid();

type SupabaseClient = Awaited<ReturnType<typeof createPureClient>>;

export const mergeGuestRecommendationHistory = async (
  supabase: SupabaseClient,
  anonId: string,
  registeredUserId: string,
) => {
  const parsedAnonId = anonIdSchema.safeParse(anonId);
  const parsedRegisteredUserId = anonIdSchema.safeParse(registeredUserId);

  if (!parsedAnonId.success || !parsedRegisteredUserId.success) {
    return { merged: false as const, error: 'invalid user id' };
  }

  if (parsedAnonId.data === parsedRegisteredUserId.data) {
    return { merged: false as const };
  }

  const { error } = await supabase.rpc('merge_guest_recommendation_history', {
    guest_user_id: parsedAnonId.data,
    registered_user_id: parsedRegisteredUserId.data,
  });

  if (error) {
    return { merged: false as const, error: error.message };
  }

  return { merged: true as const };
};
