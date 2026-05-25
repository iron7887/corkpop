'use client';

import { HeroRandomImage } from '@/components/hero-random-image';
import { Button } from '@/components/ui/button';
import { getRecommendationCardBackgroundUrl } from '@/constants/wine-recommendation-card-images';
import { formatRankedGrapesSummary } from '@/features/survey/lib/grape-catalog';
import {
  buildRecommendationItemUrl,
  buildRecommendationsListUrl,
} from '@/features/recommendation/lib/recommendation-api';
import {
  useRecommendationDisplayName,
  useRecommendationUserKey,
} from '@/features/recommendation/hooks/use-recommendation-user-id';
import { getOrCreateAnonUserId } from '@/lib/anon-user';
import { formatRetentionLabel } from '@/lib/recommendation-history';
import { motion } from 'framer-motion';
import { Sparkles, Wine, Grape } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type HistoryItem = {
  id: string;
  recommended_type: string;
  recommended_grapes: string[];
  score_snapshot: {
    summary?: string;
    reason?: string;
  };
  created_at: string;
};

const HOME_HISTORY_PREVIEW_COUNT = 5;
const HOME_HISTORY_EMPTY_DISCOVER_IMAGE = {
  src: '/myimg/discover-01.png',
  alt: '와인 추천을 시작해 보세요',
  width: 1400,
  height: 300,
} as const;
const HOME_HISTORY_EMPTY_DISCOVER_LOGIN_HOTSPOT_SIZE_PX = 180;

const sectionFadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Home() {
  const pathname = usePathname();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const recommendationUserKey = useRecommendationUserKey();
  const sessionDisplayName = useRecommendationDisplayName();

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    window.scrollTo(0, 0);
    setIsHeroVisible(false);

    const frameId = window.requestAnimationFrame(() => {
      setIsHeroVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsHistoryLoading(true);

      try {
        const anonId = getOrCreateAnonUserId();
        const response = await fetch(buildRecommendationsListUrl(anonId), {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('failed to fetch history');
        }

        const payload = (await response.json()) as { data?: HistoryItem[]; username?: string | null };
        setHistory(payload.data ?? []);
        setUsername(sessionDisplayName ?? payload.username ?? null);
      } catch {
        setHistory([]);
        setUsername(sessionDisplayName ?? null);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    void fetchHistory();
  }, [recommendationUserKey, sessionDisplayName]);

  const handleDeleteItem = async (id: string) => {
    if (deletingItemId) {
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

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <section className="mx-auto flex w-full min-w-0 max-w-page flex-col overflow-x-hidden px-5 pb-section-gap pt-section-4 md:px-8 md:pt-section-6">
        <motion.div
          className="flex flex-col gap-4"
          variants={sectionFadeIn}
          initial="hidden"
          animate={isHeroVisible ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="min-w-0 overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm">
            <HeroRandomImage />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-foreground md:text-base">
              간단한 설문으로 와인스타일 찾기
            </p>
            <Button
              asChild
              className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/survey">Go!</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-page px-5 pb-section-gap md:px-8">
        <div
          className={
            !isHistoryLoading && history.length === 0
              ? 'overflow-hidden rounded-2xl border border-border bg-card shadow-sm'
              : 'rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6'
          }
        >
          {(isHistoryLoading || history.length > 0) && (
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">이전 추천 기록</h2>
              {history.length > HOME_HISTORY_PREVIEW_COUNT && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 bg-card text-primary hover:bg-accent"
                >
                  <Link href="/history">이전 추천기록 모두보기</Link>
                </Button>
              )}
            </div>
          )}
          {(username || history.length >= HOME_HISTORY_PREVIEW_COUNT) && (
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-foreground">
              {username && <p>{username}님</p>}
              {history.length >= HOME_HISTORY_PREVIEW_COUNT && (
                <p>총 {history.length}건의 추천기록이 저장되어 있습니다.</p>
              )}
            </div>
          )}
          {isHistoryLoading && <p className="text-sm text-muted-foreground">기록을 불러오는 중입니다...</p>}
          {!isHistoryLoading && history.length === 0 && (
            <div className="relative w-full">
              <img
                src={HOME_HISTORY_EMPTY_DISCOVER_IMAGE.src}
                alt={HOME_HISTORY_EMPTY_DISCOVER_IMAGE.alt}
                width={HOME_HISTORY_EMPTY_DISCOVER_IMAGE.width}
                height={HOME_HISTORY_EMPTY_DISCOVER_IMAGE.height}
                className="block h-auto w-full"
                draggable={false}
              />
              <Link
                href="/login"
                aria-label="로그인 페이지로 이동"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{
                  width: `${HOME_HISTORY_EMPTY_DISCOVER_LOGIN_HOTSPOT_SIZE_PX}px`,
                  height: `${HOME_HISTORY_EMPTY_DISCOVER_LOGIN_HOTSPOT_SIZE_PX}px`,
                }}
              />
            </div>
          )}
          {!isHistoryLoading && history.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
                {Array.from({ length: HOME_HISTORY_PREVIEW_COUNT }, (_, index) => {
                  const item = history[index];
                  if (item) {
                    return (
                      <div key={item.id} className="min-w-0">
                        <article className="group relative isolate flex h-full min-h-[13rem] flex-col items-start justify-start overflow-hidden rounded-xl border border-primary/20 p-3 text-left shadow-sm transition hover:border-primary/30 sm:p-4 lg:min-h-[15rem] lg:p-4">
                          <Link href={`/history/${item.id}`} className="block min-w-0 flex-1">
                            <div
                              className="pointer-events-none absolute inset-0 -z-20 scale-105 bg-cover bg-center transition duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url(${getRecommendationCardBackgroundUrl(item.recommended_type)})`,
                              }}
                              aria-hidden
                            />
                            <div
                              className="pointer-events-none absolute inset-0 -z-10 bg-card/70"
                              aria-hidden
                            />
                            <p className="relative z-10 line-clamp-2 text-left text-xs font-semibold text-primary drop-shadow-sm">
                              {item.recommended_type}
                            </p>
                            <p className="relative z-10 mt-1 line-clamp-3 text-left text-xs font-medium text-foreground sm:text-sm">
                              추천 품종: {formatRankedGrapesSummary(item.recommended_grapes)}
                            </p>
                            {item.score_snapshot?.summary && (
                              <p className="relative z-10 mt-2 line-clamp-3 text-left text-xs text-foreground sm:text-sm">
                                {item.score_snapshot.summary}
                              </p>
                            )}
                            <p className="relative z-10 mt-2 text-left text-[11px] text-foreground sm:text-xs">
                              저장일: {new Date(item.created_at).toLocaleDateString('ko-KR')}
                            </p>
                            <p className="relative z-10 mt-1 text-left text-[11px] text-muted-foreground sm:text-xs">
                              {formatRetentionLabel(item.created_at)}
                            </p>
                          </Link>
                          <div className="relative z-10 mt-3 flex w-full justify-end">
                            <Button
                              type="button"
                              onClick={() => void handleDeleteItem(item.id)}
                              disabled={deletingItemId !== null}
                              className="h-8 rounded-full bg-card/90 px-3 text-xs font-semibold text-primary hover:bg-card disabled:cursor-not-allowed disabled:text-primary/30"
                            >
                              {deletingItemId === item.id ? '삭제 중...' : '기록삭제'}
                            </Button>
                          </div>
                        </article>
                      </div>
                    );
                  }
                  return (
                    <div key={`history-slot-empty-${index}`} className="min-w-0">
                      <div
                        className="flex h-full min-h-[13rem] flex-col items-start justify-start rounded-xl border border-dashed border-border bg-muted/90 p-3 text-left sm:p-4 lg:min-h-[15rem] lg:p-4"
                        role="presentation"
                      >
                        <p className="text-left text-xs font-medium text-muted-foreground/70 sm:text-sm">
                          저장기록이 없습니다.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <motion.section
        className="pb-section-gap"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="mx-auto grid w-full max-w-page gap-3 px-5 md:grid-cols-3 md:px-8"
          variants={cardStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {[
            {
              title: '취향 분석',
              description:
                '당도, 산도, 향 선호를 기반으로 스타일을 도출합니다.',
              icon: Grape,
            },
            {
              title: '카테고리 추천',
              description: '레드/화이트/로제/스파클링 중 최적 카테고리를 제안합니다.',
              icon: Wine,
            },
            {
              title: '품종 제안',
              description: '결과에 맞춰 1~3차 품종과 와인 종류를 단계별로 제안합니다.',
              icon: Sparkles,
            },
          ].map((feature) => (
            <motion.article
              key={feature.title}
              className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm"
              variants={sectionFadeIn}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <feature.icon className="mb-3 h-5 w-5 text-primary" />
              <h2 className="mb-2 text-lg font-semibold text-primary">
                {feature.title}
              </h2>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto w-full max-w-page px-5 pb-section-gap md:px-8"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-primary md:text-3xl">
            이용 방법
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
            처음이어도 부담 없이 3단계로 끝낼 수 있습니다.
          </p>
        </div>
        <motion.div
          className="grid gap-3 md:grid-cols-3"
          variants={cardStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {[
            '기본 취향 설문',
            '카테고리 기반 추가 설문',
            '결과 확인 및 와인스타일 저장',
          ].map((step, index) => (
            <motion.div
              key={step}
              className="rounded-2xl border border-border bg-secondary/60 p-4"
              variants={sectionFadeIn}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <p className="mb-1.5 text-xs font-semibold text-primary">
                STEP {index + 1}
              </p>
              <p className="text-sm font-medium text-foreground">{step}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="h-14 shrink-0 whitespace-nowrap rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90"
          >
            <Link
              href="/survey"
              className="flex h-full items-center justify-center text-sm font-semibold"
            >
              {'지금 시작하기 >'}
            </Link>
          </Button>
        </div>
      </motion.section>

    </main>
  );
}
