import { checkNicknameSchema } from '@/features/auth/constants/signup-schema';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('nickname') ?? '';

  const parsed = checkNicknameSchema.safeParse({ nickname });
  if (!parsed.success) {
    return NextResponse.json(
      { error: '닉네임 형식이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase.rpc('is_nickname_available', {
    candidate: parsed.data.nickname,
  });

  if (error) {
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .ilike('username', parsed.data.nickname)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ available: !existingProfile });
  }

  return NextResponse.json({ available: Boolean(data) });
}
