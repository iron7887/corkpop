import { resolveRecommendationUserId } from '@/lib/recommendation-user';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const saveRecommendationSchema = z.object({
  category: z.string().min(1),
  sweetness: z.string().min(1),
  primaryGrape: z.string().min(1),
  secondaryGrape: z.string().min(1),
  tertiaryGrape: z.string().min(1),
  summary: z.string().min(1),
  reason: z.string().min(1),
  situations: z.array(z.string().min(1)).min(1),
});

export async function GET() {
  const resolvedUser = await resolveRecommendationUserId();

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 401 });
  }

  const { userId } = resolvedUser;
  const supabase = await createPureClient();

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('recommendation_history')
    .select('id, recommended_type, recommended_grapes, score_snapshot, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    username: profile?.username ?? null,
  });
}

export async function POST(request: Request) {
  const resolvedUser = await resolveRecommendationUserId();
  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 401 });
  }

  const body = await request.json();
  const parsed = saveRecommendationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    category,
    sweetness,
    primaryGrape,
    secondaryGrape,
    tertiaryGrape,
    summary,
    reason,
    situations,
  } = parsed.data;

  const { userId } = resolvedUser;
  const supabase = await createPureClient();

  const { data: registeredProfile, error: registeredProfileError } = await supabase
    .from('user_profiles')
    .select('username')
    .eq('id', userId)
    .eq('user_type', 'registered')
    .maybeSingle();

  if (registeredProfileError) {
    return NextResponse.json({ error: registeredProfileError.message }, { status: 500 });
  }

  if (!registeredProfile) {
    return NextResponse.json({ error: 'registered profile not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('recommendation_history')
    .insert({
      user_id: userId,
      recommended_type: `${sweetness} ${category}`,
      recommended_grapes: [primaryGrape, secondaryGrape, tertiaryGrape],
      score_snapshot: {
        category,
        sweetness,
        summary,
        reason,
        situations,
      },
    })
    .select('id, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { data, username: registeredProfile.username },
    { status: 201 },
  );
}

export async function DELETE() {
  const resolvedUser = await resolveRecommendationUserId();

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 401 });
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase
    .from('recommendation_history')
    .delete()
    .eq('user_id', resolvedUser.userId)
    .select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deletedCount: data.length });
}
