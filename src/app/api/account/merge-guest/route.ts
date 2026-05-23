import { mergeGuestRecommendationHistory } from '@/features/recommendation/lib/merge-guest-history';
import { getAuthSession } from '@/lib/auth-session';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const mergeGuestSchema = z.object({
  anonId: z.string().uuid(),
});

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = mergeGuestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid anonId' }, { status: 400 });
  }

  const supabase = await createPureClient();
  const result = await mergeGuestRecommendationHistory(
    supabase,
    parsed.data.anonId,
    session.user.id,
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ merged: result.merged });
}
