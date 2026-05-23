import { sanitizeAuthNextPath } from '@/lib/supabase/auth-config';
import { createRouteHandlerClient } from '@/lib/supabase/route-handler';
import type { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_ERROR_REDIRECT = '/signup?error=auth_callback';
const AUTH_CONFIRM_REDIRECT = '/auth/confirm';

const isEmailOtpType = (value: string | null): value is EmailOtpType => {
  return (
    value === 'signup' ||
    value === 'invite' ||
    value === 'magiclink' ||
    value === 'recovery' ||
    value === 'email_change' ||
    value === 'email'
  );
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const nextPath = sanitizeAuthNextPath(requestUrl.searchParams.get('next'));

  if (!code && !tokenHash) {
    const confirmUrl = new URL(AUTH_CONFIRM_REDIRECT, requestUrl.origin);
    confirmUrl.searchParams.set('next', nextPath);
    return NextResponse.redirect(confirmUrl);
  }

  const successUrl = new URL(nextPath, requestUrl.origin);
  let response = NextResponse.redirect(successUrl);
  const supabase = createRouteHandlerClient(request, response);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
  }

  if (tokenHash && isEmailOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(new URL(AUTH_ERROR_REDIRECT, requestUrl.origin));
}
