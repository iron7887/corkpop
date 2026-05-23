'use client';

import { LoginForm } from '@/features/auth/components/login-form';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginPageContent() {
  return (
    <div className="mx-auto w-full max-w-md px-1 py-2">
      <h1 className="text-center text-2xl font-bold text-primary">로그인</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        이메일과 비밀번호로 로그인하세요.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          홈으로 돌아가기
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-5 py-section-12 text-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-page flex-col items-center">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">로그인 화면을 불러오는 중...</p>
          }
        >
          <LoginPageContent />
        </Suspense>
      </div>
    </main>
  );
}
