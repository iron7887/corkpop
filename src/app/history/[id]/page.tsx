'use client';

import { Button } from '@/components/ui/button';
import { RANKED_GRAPE_TIER_COPY } from '@/features/survey/constants/ranked-grape-tiers';
import {
  findGrapeProfileByNameKo,
  getWineKindLabelByGrapeNameKo,
} from '@/features/survey/lib/grape-catalog';
import { buildRecommendationItemUrl } from '@/features/recommendation/lib/recommendation-api';
import { useRecommendationUserKey } from '@/features/recommendation/hooks/use-recommendation-user-id';
import { getOrCreateAnonUserId } from '@/lib/anon-user';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

type RecommendationDetail = {
  id: string;
  recommended_type: string;
  recommended_grapes: string[];
  score_snapshot: {
    category?: string;
    sweetness?: string;
    summary?: string;
    reason?: string;
    situations?: string[];
  };
  created_at: string;
};

const formatTypeLabel = (value: string) => {
  const [sweetness, category] = value.split(' ');
  return `${sweetness ?? ''} ${category ?? ''}`.trim();
};

export default function RecommendationDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<RecommendationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const recommendationUserKey = useRecommendationUserKey();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const anonId = getOrCreateAnonUserId();
        const response = await fetch(buildRecommendationItemUrl(params.id, anonId), {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('상세 결과를 불러오지 못했습니다.');
        }

        const payload = (await response.json()) as { data: RecommendationDetail };
        setDetail(payload.data);
      } catch {
        setDetail(null);
        setErrorMessage('상세 결과를 불러오지 못했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      void fetchDetail();
    }
  }, [params.id, recommendationUserKey]);

  const situations = useMemo(() => {
    return detail?.score_snapshot?.situations ?? [];
  }, [detail?.score_snapshot?.situations]);

  return (
    <main className="min-h-screen bg-background px-5 py-section-10 text-foreground md:px-8">
      <section className="mx-auto w-full max-w-page rounded-3xl border border-primary/20 bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-primary hover:text-primary">
            ← 홈으로
          </Link>
          <Link href="/survey" className="text-sm font-semibold text-primary hover:text-primary">
            새 설문 하기
          </Link>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">상세 결과를 불러오는 중입니다...</p>}

        {!isLoading && errorMessage && (
          <div className="space-y-4">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        )}

        {!isLoading && detail && (
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              저장된 추천 결과
            </p>
            <div>
              <h1 className="text-2xl font-bold text-primary">당신의 와인 취향 상세</h1>
              <p className="mt-2 text-foreground">{formatTypeLabel(detail.recommended_type)}</p>
            </div>

            <article className="rounded-2xl border border-primary/20 bg-accent/60 p-5">
              {detail.score_snapshot?.summary && (
                <h2 className="text-lg font-semibold text-primary">{detail.score_snapshot.summary}</h2>
              )}
              {detail.score_snapshot?.reason && (
                <p className="mt-2 text-sm text-foreground">{detail.score_snapshot.reason}</p>
              )}
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  추천 품종 (와인 종류별 · 1~3차)
                </p>
                <ul className="mt-3 space-y-3">
                  {detail.recommended_grapes.map((nameKo, i) => {
                    const profile = findGrapeProfileByNameKo(nameKo);
                    const kindLabel = getWineKindLabelByGrapeNameKo(nameKo);
                    const tierMeta =
                      RANKED_GRAPE_TIER_COPY[i] ?? { tier: `${i + 1}차 추천`, hint: '' };
                    return (
                      <li
                        key={`${nameKo}-${i}`}
                        className="rounded-xl border border-primary/20/80 bg-card/70 p-3 shadow-sm"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs font-semibold text-primary">{tierMeta.tier}</p>
                          {tierMeta.hint ? (
                            <p className="text-[11px] text-muted-foreground">{tierMeta.hint}</p>
                          ) : null}
                        </div>
                        {kindLabel && (
                          <p className="mt-2 text-xs font-medium text-muted-foreground">
                            종류 · <span className="text-foreground">{kindLabel}</span>
                          </p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {nameKo}
                          {profile && (
                            <span className="font-normal text-muted-foreground"> ({profile.nameEn})</span>
                          )}
                        </p>
                        {profile && (
                          <p className="mt-2 text-sm text-foreground">
                            <span className="font-medium text-muted-foreground">스타일 ·</span>{' '}
                            {profile.styleHint}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">추천 상황</p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {situations.length === 0 && <li>- 추천 상황 정보가 없습니다.</li>}
                {situations.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                저장일: {new Date(detail.created_at).toLocaleString('ko-KR')}
              </p>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}
