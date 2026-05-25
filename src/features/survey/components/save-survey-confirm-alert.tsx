'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type SaveSurveyConfirmAlertProps = {
  open: boolean;
  accountLabel: string;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function SaveSurveyConfirmAlert({
  open,
  accountLabel,
  isSaving,
  onOpenChange,
  onConfirm,
}: SaveSurveyConfirmAlertProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="save-survey-alert-title"
      aria-describedby="save-survey-alert-description"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 id="save-survey-alert-title" className="text-center text-lg font-bold text-primary">
          {accountLabel} 계정으로 설문결과를 저장하시겠습니까?
        </h2>
        <p
          id="save-survey-alert-description"
          className="mt-3 text-center text-sm text-muted-foreground"
        >
          저장하면 나의 와인과 홈에서 이전 추천 기록을 확인할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-2xl"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
            disabled={isSaving}
            onClick={onConfirm}
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
