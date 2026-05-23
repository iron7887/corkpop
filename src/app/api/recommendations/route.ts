import { RECOMMENDATION_HISTORY_RETENTION_DAYS } from '@/constants/recommendation-history';
import { resolveRecommendationUserId } from '@/lib/recommendation-user';
import { createPureClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const getRetentionThresholdIso = () =>
  subDays(new Date(), RECOMMENDATION_HISTORY_RETENTION_DAYS).toISOString();

const purgeExpiredRecommendations = async (
  supabase: Awaited<ReturnType<typeof createPureClient>>,
  userId?: string,
) => {
  const thresholdIso = getRetentionThresholdIso();
  const query = supabase
    .from('recommendation_history')
    .delete()
    .lt('created_at', thresholdIso);

  const { error } = userId ? await query.eq('user_id', userId) : await query;

  if (error) {
    throw new Error(error.message);
  }
};

const formatUsernamePrefix = (grape: string) => {
  return grape.replace(/\s+/g, '');
};

const createRandomSuffix = () => {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
};

const createUsernameCandidate = (grape: string) => {
  return `${formatUsernamePrefix(grape)}-${createRandomSuffix()}`;
};

const resolveUsername = async (supabase: Awaited<ReturnType<typeof createPureClient>>, grape: string) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = createUsernameCandidate(grape);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }
  }

  throw new Error('username generation failed');
};

const saveRecommendationSchema = z.object({
  anonId: z.string().uuid(),
  category: z.string().min(1),
  sweetness: z.string().min(1),
  primaryGrape: z.string().min(1),
  secondaryGrape: z.string().min(1),
  tertiaryGrape: z.string().min(1),
  summary: z.string().min(1),
  reason: z.string().min(1),
  situations: z.array(z.string().min(1)).min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resolvedUser = await resolveRecommendationUserId(searchParams.get('anonId'));

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 400 });
  }

  const { userId } = resolvedUser;
  const supabase = await createPureClient();

  try {
    await purgeExpiredRecommendations(supabase, userId);
  } catch (purgeError) {
    const message = purgeError instanceof Error ? purgeError.message : 'failed to purge expired recommendations';
    return NextResponse.json({ error: message }, { status: 500 });
  }

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
    .gte('created_at', getRetentionThresholdIso())
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    username: profile?.username ?? null,
    retentionDays: RECOMMENDATION_HISTORY_RETENTION_DAYS,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = saveRecommendationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    anonId,
    category,
    sweetness,
    primaryGrape,
    secondaryGrape,
    tertiaryGrape,
    summary,
    reason,
    situations,
  } = parsed.data;

  const resolvedUser = await resolveRecommendationUserId(anonId);
  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 400 });
  }

  const { userId } = resolvedUser;
  const supabase = await createPureClient();

  if (resolvedUser.source === 'session') {
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

  const { data: existingProfile, error: profileReadError } = await supabase
    .from('user_profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle();

  if (profileReadError) {
    return NextResponse.json({ error: profileReadError.message }, { status: 500 });
  }

  const username = existingProfile?.username || (await resolveUsername(supabase, primaryGrape));

  const { error: profileError } = await supabase.from('user_profiles').upsert(
    {
      id: userId,
      username,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
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

  return NextResponse.json({ data, username }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const resolvedUser = await resolveRecommendationUserId(searchParams.get('anonId'));

  if ('error' in resolvedUser) {
    return NextResponse.json({ error: resolvedUser.error }, { status: 400 });
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
