import { getAuthSession } from '@/lib/auth-session';
import { createPureClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const WITHDRAW_SYSTEM_ERROR =
  '시스템 오류로 탈퇴기능이 수행되지 않았습니다. 관리자에게 문의하세요';

export async function DELETE() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: WITHDRAW_SYSTEM_ERROR }, { status: 401 });
  }

  const userId = session.user.id;
  const supabase = await createPureClient();

  const { data: profile, error: profileFetchError } = await supabase
    .from('user_profiles')
    .select('id, user_type')
    .eq('id', userId)
    .maybeSingle();

  if (profileFetchError || !profile || profile.user_type !== 'registered') {
    return NextResponse.json({ error: WITHDRAW_SYSTEM_ERROR }, { status: 500 });
  }

  const { error: deleteProfileError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId);

  if (deleteProfileError) {
    return NextResponse.json({ error: WITHDRAW_SYSTEM_ERROR }, { status: 500 });
  }

  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);

  if (deleteAuthError) {
    return NextResponse.json({ error: WITHDRAW_SYSTEM_ERROR }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
