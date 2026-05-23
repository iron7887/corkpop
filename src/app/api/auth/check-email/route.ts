import { checkEmailSchema } from '@/features/auth/constants/signup-schema';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const checkEmailInProfiles = async (
  supabase: Awaited<ReturnType<typeof createPureClient>>,
  email: string,
) => {
  const { data: existingProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_type', 'registered')
    .ilike('email', email)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return !existingProfile;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') ?? '';

  const parsed = checkEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return NextResponse.json(
      { error: '이메일 형식이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  const normalizedEmail = parsed.data.email;
  const supabase = await createPureClient();

  const { data, error } = await supabase.rpc('is_email_available', {
    candidate: normalizedEmail,
  });

  if (!error) {
    return NextResponse.json({ available: Boolean(data) });
  }

  try {
    const availableInProfiles = await checkEmailInProfiles(supabase, normalizedEmail);
    return NextResponse.json({ available: availableInProfiles });
  } catch (fallbackError) {
    const message =
      fallbackError instanceof Error ? fallbackError.message : '이메일 확인에 실패했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
