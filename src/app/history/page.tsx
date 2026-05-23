'use client';

import { Button } from '@/components/ui/button';
import { getRecommendationCardBackgroundUrl } from '@/constants/wine-recommendation-card-images';
import { formatRankedGrapesSummary } from '@/features/survey/lib/grape-catalog';
import {
  buildRecommendationItemUrl,
  buildRecommendationsListUrl,
} from '@/features/recommendation/lib/recommendation-api';
import { useRecommendationUserKey } from '@/features/recommendation/hooks/use-recommendation-user-id';
import { getOrCreateAnonUserId } from '@/lib/anon-user';
import { formatRetentionLabel } from '@/lib/recommendation-history';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type HistoryItem = {
  id: string;
  recommended_type: string;
  recommended_grapes: string[];
  score_snapshot: {
    summary?: string;
  };
  created_at: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const recommendationUserKey = useRecommendationUserKey();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);

      try {
        const anonId = getOrCreateAnonUserId();
        const response = await fetch(buildRecommendationsListUrl(anonId), {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('failed to fetch history');
        }

        const payload = (await response.json()) as { data?: HistoryItem[] };
        setHistory(payload.data ?? []);
      } catch {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchHistory();
  }, [recommendationUserKey]);

  const handleDeleteItem = async (id: string) => {
    if (deletingItemId || isDeletingAll) {
      return;
    }

    const confirmed = window.confirm('이 추천기록을 삭제할까요?');
    if (!confirmed) {
      return;
    }

    setDeletingItemId(id);

    try {
      const anonId = getOrCreateAnonUserId();
      const response = await fetch(buildRecommendationItemUrl(id, anonId), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('failed to delete item');
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch {
      window.alert('기록 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (isDeletingAll || deletingItemId || history.length === 0) {
      return;
    }

    const confirmed = window.confirm('모든 추천기록을 삭제할까요?');
    if (!confirmed) {
      return;
    }

    setIsDeletingAll(true);

    try {
      const anonId = getOrCreateAnonUserId();
      const response = await fetch(buildRecommendationsListUrl(anonId), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('failed to delete all history');
      }

      setHistory([]);
    } catch {
      window.alert('모든 기록 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-5 pt-section-12 pb-section-gap text-foreground md:px-8">
      <section className="mx-auto w-full max-w-page rounded-3xl border border-primary/20 bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">이전 추천기록 전체보기</h1>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => void handleDeleteAll()}
            disabled={isDeletingAll || deletingItemId !== null || history.length === 0}
          >
            {isDeletingAll ? '삭제 중...' : '모든기록삭제'}
          </Button>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">기록을 불러오는 중입니다...</p>}

        {!isLoading && history.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/90 p-6 text-center">
            <p className="text-sm text-muted-foreground">저장된 추천기록이 없습니다.</p>
          </div>
        )}

        {!isLoading && history.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <article
                key={item.id}
                className="group relative isolate overflow-hidden rounded-xl border border-primary/20 p-4 shadow-sm transition hover:border-primary/30"
              >
                <div
                  className="pointer-events-none absolute inset-0 -z-20 scale-105 bg-cover bg-center transition duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${getRecommendationCardBackgroundUrl(item.recommended_type)})`,
                  }}
                  aria-hidden
                />
                <div className="pointer-events-none absolute inset-0 -z-10 bg-card/70" aria-hidden />
                <Link href={`/history/${item.id}`} className="block">
                  <p className="line-clamp-2 text-sm font-semibold text-primary drop-shadow-sm">
                    {item.recommended_type}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground">
                    추천 품종: {formatRankedGrapesSummary(item.recommended_grapes)}
                  </p>
                  {item.score_snapshot?.summary && (
                    <p className="mt-2 line-clamp-3 text-sm text-foreground">
                      {item.score_snapshot.summary}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-foreground">
                    저장일: {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </p>
                  <p className="mt-1 text-xs text-foreground">
                    {formatRetentionLabel(item.created_at)}
                  </p>
                </Link>
                <div className="mt-3 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => void handleDeleteItem(item.id)}
                    disabled={deletingItemId !== null || isDeletingAll}
                    className="h-8 rounded-full bg-card/90 px-3 text-xs font-semibold text-primary hover:bg-card disabled:cursor-not-allowed disabled:text-primary/30"
                  >
                    {deletingItemId === item.id ? '삭제 중...' : '기록삭제'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
