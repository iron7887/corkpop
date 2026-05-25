import { apiSignupSchema } from '@/features/auth/constants/signup-schema';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const getEmailRedirectUrl = (request: Request) => {
  const origin = request.headers.get('origin');
  if (origin) {
    return `${origin}/auth/callback?next=/signup/complete`;
  }

  const siteUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl}/auth/callback?next=/signup/complete`;
  }

  return undefined;
};

const mapSignupError = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes('nickname already taken')) {
    return '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.';
  }

  if (normalized.includes('user already registered')) {
    return '이미 가입된 이메일입니다. 로그인해 주세요.';
  }

  if (normalized.includes('invalid email')) {
    return '올바른 이메일 형식이 아닙니다.';
  }

  return message;
};

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = apiSignupSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.';
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const { email, nickname, password } = parsed.data;
  const supabase = await createPureClient();

  const { data: isEmailAvailable, error: emailError } = await supabase.rpc(
    'is_email_available',
    { candidate: email },
  );

  if (emailError) {
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_type', 'registered')
      .ilike('email', email)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다. 로그인해 주세요.' },
        { status: 409 },
      );
    }
  } else if (!isEmailAvailable) {
    return NextResponse.json(
      { error: '이미 가입된 이메일입니다. 로그인해 주세요.' },
      { status: 409 },
    );
  }

  const { data: isAvailable, error: nicknameError } = await supabase.rpc(
    'is_nickname_available',
    { candidate: nickname },
  );

  if (nicknameError) {
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .ilike('username', nickname)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.' },
        { status: 409 },
      );
    }
  } else if (!isAvailable) {
    return NextResponse.json(
      { error: '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.' },
      { status: 409 },
    );
  }

  const emailRedirectTo = getEmailRedirectUrl(request);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
      emailRedirectTo,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: mapSignupError(error.message) },
      { status: 400 },
    );
  }

  if (!data.user) {
    return NextResponse.json(
      { error: '회원가입 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message:
        '회원가입이 완료되었습니다. 입력하신 이메일로 인증 메일을 보냈습니다. 메일의 링크를 눌러 인증을 완료해 주세요.',
      email,
    },
    { status: 201 },
  );
}
