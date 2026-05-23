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
      className="mt-8 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm"
      aria-label="발송된 인증 메일 미리보기"
    >
      <header className="border-b border-rose-100 bg-gradient-to-br from-rose-50 to-stone-50 px-5 py-4">
        <div className="flex items-center gap-2 text-rose-900">
          <Mail className="h-5 w-5 shrink-0" aria-hidden />
          <p className="text-lg font-extrabold tracking-tight">MyWineType</p>
        </div>
        <p className="mt-1 text-xs text-stone-500">와인 취향 설문 기반 추천 서비스</p>
      </header>

      <div className="space-y-4 px-5 py-6">
        <h2 className="text-base font-bold text-rose-900">{CONFIRM_SIGNUP_EMAIL_HEADLINE}</h2>
        <p className="text-sm leading-relaxed text-stone-700">{CONFIRM_SIGNUP_EMAIL_BODY}</p>

        <div
          className="inline-flex rounded-2xl bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
          aria-hidden
        >
          {CONFIRM_SIGNUP_EMAIL_CTA_LABEL}
        </div>

        <p className="text-xs leading-relaxed text-stone-500">
          실제 메일에는 인증 링크가 포함됩니다.
          {email ? (
            <>
              <br />
              수신 주소: <span className="font-medium text-stone-700">{email}</span>
            </>
          ) : null}
        </p>

        <p className="border-t border-stone-100 pt-4 text-xs text-stone-400">
          {CONFIRM_SIGNUP_EMAIL_FOOTER}
        </p>
      </div>
    </article>
  );
}
