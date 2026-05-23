import { RECOMMENDATION_HISTORY_RETENTION_DAYS } from '@/constants/recommendation-history';
import { resolveRecommendationUserId } from '@/lib/recommendation-user';
import { createPureClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const getRetentionThresholdIso = () =>
  subDays(new Date(), RECOMMENDATION_HISTORY_RETENTION_DAYS).toISOString();

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const parsedParams = paramsSchema.safeParse(resolvedParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: 'invalid recommendation id' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const resolvedUser = await resolveRecommendationUserId(searchParams.get('anonId'));

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 400 });
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase
    .from('recommendation_history')
    .select('id, recommended_type, recommended_grapes, score_snapshot, created_at')
    .eq('id', parsedParams.data.id)
    .eq('user_id', resolvedUser.userId)
    .gte('created_at', getRetentionThresholdIso())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'recommendation not found' }, { status: 404 });
  }

  return NextResponse.json({ data, retentionDays: RECOMMENDATION_HISTORY_RETENTION_DAYS });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const parsedParams = paramsSchema.safeParse(resolvedParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: 'invalid recommendation id' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const resolvedUser = await resolveRecommendationUserId(searchParams.get('anonId'));

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 400 });
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase
    .from('recommendation_history')
    .delete()
    .eq('id', parsedParams.data.id)
    .eq('user_id', resolvedUser.userId)
    .select('id')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'recommendation not found' }, { status: 404 });
  }

  return NextResponse.json({ data });
}
