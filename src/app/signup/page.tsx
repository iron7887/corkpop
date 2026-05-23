'use client';

import { SignupForm } from '@/features/auth/components/signup-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignupPageContent() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');

  return (
    <div className="mx-auto w-full max-w-md px-1 py-2">
      <h1 className="text-center text-2xl font-bold text-primary">회원가입</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        이메일 인증 후 서비스를 이용할 수 있습니다.
      </p>

      {callbackError === 'auth_callback' ? (
        <p
          className="mt-4 rounded-xl bg-accent px-4 py-3 text-sm text-primary"
          role="alert"
        >
          이메일 인증 링크가 만료되었거나 유효하지 않습니다. 다시 회원가입을 진행해 주세요.
        </p>
      ) : null}

      <div className="mt-8">
        <SignupForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          홈으로 돌아가기
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background px-5 pt-section-12 pb-section-gap text-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-page flex-col items-center">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">회원가입 화면을 불러오는 중...</p>
          }
        >
          <SignupPageContent />
        </Suspense>
      </div>
    </div>
  );
}
