'use client';

import { Button } from '@/components/ui/button';
import { ConfirmSignupEmailPreview } from '@/features/auth/components/confirm-signup-email-preview';
import { CONFIRM_SIGNUP_EMAIL_SUBJECT } from '@/features/auth/constants/confirm-signup-email';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignupCompleteContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <section className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
          <MailCheck className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-primary">인증 메일을 확인해 주세요</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          아래와 같은 제목의 메일이 발송되었습니다.
          <br />
          <span className="font-medium text-foreground">{CONFIRM_SIGNUP_EMAIL_SUBJECT}</span>
        </p>
      </div>

      <ConfirmSignupEmailPreview email={email} />

      <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        메일함에서 인증 링크를 눌러 인증을 마치면 로그인할 수 있습니다.
        <br />
        메일이 보이지 않으면 스팸함도 확인해 주세요.
      </p>

      <Button
        asChild
        className="mt-8 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Link href="/login">로그인 페이지로 이동</Link>
      </Button>
      <Button asChild variant="ghost" className="mt-2 w-full text-muted-foreground">
        <Link href="/">홈으로</Link>
      </Button>
    </section>
  );
}

export default function SignupCompletePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background px-5 py-section-12 text-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-page flex-col items-center">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">안내 화면을 불러오는 중...</p>
          }
        >
          <SignupCompleteContent />
        </Suspense>
      </div>
    </div>
  );
}
