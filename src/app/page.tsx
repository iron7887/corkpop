'use client';

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const recommendationUserKey = useRecommendationUserKey();
  const sessionDisplayName = useRecommendationDisplayName();

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
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <motion.section
        className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-5 pt-4 md:px-8 md:pt-6"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
          <motion.div
            className="flex h-full min-h-0 flex-col gap-4"
            variants={sectionFadeIn}
            transition={{ delay: 0.05, duration: 0.5, ease: 'easeOut' }}
          >
            <h1 className="inline-flex w-fit flex-col items-start gap-3 self-start">
              <span className="inline-flex w-full items-center justify-center rounded-full bg-rose-100 px-3 py-1 text-center text-xs font-semibold text-rose-800">
                <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden />
                2분 설문으로 찾는 나만의 와인
              </span>
            </h1>
            <p className="max-w-xl text-sm text-stone-600 md:text-base">
              간단한 질문에 답하면 당도와 스타일을 분석해 당신에게 맞는 와인
              카테고리와 품종을 추천합니다.
            </p>
            <div className="flex min-h-0 flex-col items-start md:flex-1 md:justify-end">
              <Button
                asChild
                className="h-14 shrink-0 whitespace-nowrap rounded-2xl bg-rose-700 px-5 text-white hover:bg-rose-800"
              >
                <Link
                  href="/survey"
                  className="flex h-full items-center justify-center text-sm font-semibold"
                >
                  {'지금 시작하기 >'}
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="min-h-[220px] overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm md:flex md:h-full md:min-h-0 md:flex-col"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.img
              src="/myimg/land-main.png"
              alt="드론으로 내려다본 광활한 포도밭 전경"
              className="h-full min-h-[220px] w-full object-cover md:min-h-0 md:flex-1"
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      </motion.section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-3 md:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-rose-900">이전 추천 기록</h2>
            {history.length > HOME_HISTORY_PREVIEW_COUNT && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
              >
                <Link href="/history">이전 추천기록 모두보기</Link>
              </Button>
            )}
          </div>
          {(username || history.length >= HOME_HISTORY_PREVIEW_COUNT) && (
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-stone-700">
              {username && <p>{username}님</p>}
              {history.length >= HOME_HISTORY_PREVIEW_COUNT && (
                <p>총 {history.length}건의 추천기록이 저장되어 있습니다.</p>
              )}
            </div>
          )}
          {isHistoryLoading && <p className="text-sm text-stone-500">기록을 불러오는 중입니다...</p>}
          {!isHistoryLoading && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
                {Array.from({ length: HOME_HISTORY_PREVIEW_COUNT }, (_, index) => {
                  const item = history[index];
                  if (item) {
                    return (
                      <div key={item.id} className="min-w-0">
                        <article className="group relative isolate flex h-full min-h-[13rem] flex-col items-start justify-start overflow-hidden rounded-xl border border-rose-100 p-3 text-left shadow-sm transition hover:border-rose-200 sm:p-4 lg:min-h-[15rem] lg:p-4">
                          <Link href={`/history/${item.id}`} className="block min-w-0 flex-1">
                            <div
                              className="pointer-events-none absolute inset-0 -z-20 scale-105 bg-cover bg-center transition duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url(${getRecommendationCardBackgroundUrl(item.recommended_type)})`,
                              }}
                              aria-hidden
                            />
                            <div
                              className="pointer-events-none absolute inset-0 -z-10 bg-white/70"
                              aria-hidden
                            />
                            <p className="relative z-10 line-clamp-2 text-left text-xs font-semibold text-rose-900 drop-shadow-sm">
                              {item.recommended_type}
                            </p>
                            <p className="relative z-10 mt-1 line-clamp-3 text-left text-xs font-medium text-stone-900 sm:text-sm">
                              추천 품종: {formatRankedGrapesSummary(item.recommended_grapes)}
                            </p>
                            {item.score_snapshot?.summary && (
                              <p className="relative z-10 mt-2 line-clamp-3 text-left text-xs text-stone-800 sm:text-sm">
                                {item.score_snapshot.summary}
                              </p>
                            )}
                            <p className="relative z-10 mt-2 text-left text-[11px] text-stone-700 sm:text-xs">
                              저장일: {new Date(item.created_at).toLocaleDateString('ko-KR')}
                            </p>
                            <p className="relative z-10 mt-1 text-left text-[11px] text-stone-600 sm:text-xs">
                              {formatRetentionLabel(item.created_at)}
                            </p>
                          </Link>
                          <div className="relative z-10 mt-3 flex w-full justify-end">
                            <Button
                              type="button"
                              onClick={() => void handleDeleteItem(item.id)}
                              disabled={deletingItemId !== null}
                              className="h-8 rounded-full bg-white/90 px-3 text-xs font-semibold text-rose-700 hover:bg-white disabled:cursor-not-allowed disabled:text-rose-300"
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
                        className="flex h-full min-h-[13rem] flex-col items-start justify-start rounded-xl border border-dashed border-stone-200 bg-stone-50/90 p-3 text-left sm:p-4 lg:min-h-[15rem] lg:p-4"
                        role="presentation"
                      >
                        <p className="text-left text-xs font-medium text-stone-400 sm:text-sm">저장기록이 없습니다.</p>
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
        className="bg-rose-50/60 py-10"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="mx-auto grid w-full max-w-6xl gap-3 px-5 md:grid-cols-3 md:px-8"
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
              className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
              variants={sectionFadeIn}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <feature.icon className="mb-3 h-5 w-5 text-rose-700" />
              <h2 className="mb-2 text-lg font-semibold text-rose-900">
                {feature.title}
              </h2>
              <p className="text-sm text-stone-600">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-rose-900 md:text-3xl">
            이용 방법
          </h3>
          <p className="mt-1.5 text-sm text-stone-600 md:text-base">
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
            '기본 취향 설문 5문항',
            '카테고리 기반 추가 설문',
            '결과 확인 및 추천 와인 저장',
          ].map((step, index) => (
            <motion.div
              key={step}
              className="rounded-2xl border border-stone-200 bg-stone-100/60 p-4"
              variants={sectionFadeIn}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <p className="mb-1.5 text-xs font-semibold text-rose-700">
                STEP {index + 1}
              </p>
              <p className="text-sm font-medium text-stone-800">{step}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="h-14 shrink-0 whitespace-nowrap rounded-2xl bg-rose-700 px-5 text-white hover:bg-rose-800"
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
