'use client';

import {
  CONFIRM_SIGNUP_EMAIL_BODY,
  CONFIRM_SIGNUP_EMAIL_CTA_LABEL,
  CONFIRM_SIGNUP_EMAIL_FOOTER,
  CONFIRM_SIGNUP_EMAIL_HEADLINE,
} from '@/features/auth/constants/confirm-signup-email';
import { Mail } from 'lucide-react';

type ConfirmSignupEmailPreviewProps = {
  email: string | null;
};

export function ConfirmSignupEmailPreview({ email }: ConfirmSignupEmailPreviewProps) {
  return (
    <article
      className="mt-8 w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm"
      aria-label="발송된 인증 메일 미리보기"
    >
      <header className="border-b border-primary/20 bg-gradient-to-br from-accent to-background px-5 py-4">
        <div className="flex items-center gap-2 text-primary">
          <Mail className="h-5 w-5 shrink-0" aria-hidden />
          <p className="text-lg font-extrabold tracking-tight">CorkPop</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">와인 취향 설문 기반 추천 서비스</p>
      </header>

      <div className="space-y-4 px-5 py-6">
        <h2 className="text-base font-bold text-primary">{CONFIRM_SIGNUP_EMAIL_HEADLINE}</h2>
        <p className="text-sm leading-relaxed text-foreground">{CONFIRM_SIGNUP_EMAIL_BODY}</p>

        <div
          className="inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          aria-hidden
        >
          {CONFIRM_SIGNUP_EMAIL_CTA_LABEL}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          실제 메일에는 인증 링크가 포함됩니다.
          {email ? (
            <>
              <br />
              수신 주소: <span className="font-medium text-foreground">{email}</span>
            </>
          ) : null}
        </p>

        <p className="border-t border-border pt-4 text-xs text-muted-foreground/70">
          {CONFIRM_SIGNUP_EMAIL_FOOTER}
        </p>
      </div>
    </article>
  );
}
