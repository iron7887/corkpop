'use client';

import { sanitizeAuthNextPath } from '@/lib/supabase/auth-config';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeAuthNextPath(searchParams.get('next'));
  const [message, setMessage] = useState('이메일 인증을 확인하고 있습니다...');

  useEffect(() => {
    const supabase = createClient();
    let isActive = true;

    const completeAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!isActive) {
          return;
        }

        if (!error) {
          router.replace(nextPath);
          return;
        }
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (session && !sessionError) {
        router.replace(nextPath);
        return;
      }

      setMessage('이메일 인증에 실패했습니다. 링크가 만료되었을 수 있습니다.');
      router.replace('/signup?error=auth_callback');
    };

    void completeAuth();

    return () => {
      isActive = false;
    };
  }, [nextPath, router]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-background px-5 py-section-12 text-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background text-sm text-muted-foreground">
          인증 처리 중...
        </div>
      }
    >
      <AuthConfirmContent />
    </Suspense>
  );
}
