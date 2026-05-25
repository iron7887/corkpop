import { resolveRecommendationUserId } from '@/lib/recommendation-user';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const parsedParams = paramsSchema.safeParse(resolvedParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: 'invalid recommendation id' }, { status: 400 });
  }

  const resolvedUser = await resolveRecommendationUserId();

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 401 });
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase
    .from('recommendation_history')
    .select('id, recommended_type, recommended_grapes, score_snapshot, created_at')
    .eq('id', parsedParams.data.id)
    .eq('user_id', resolvedUser.userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'recommendation not found' }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const parsedParams = paramsSchema.safeParse(resolvedParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: 'invalid recommendation id' }, { status: 400 });
  }

  const resolvedUser = await resolveRecommendationUserId();

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 401 });
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
