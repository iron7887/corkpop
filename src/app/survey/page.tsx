'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RECOMMENDATION_HISTORY_RETENTION_DAYS } from '@/constants/recommendation-history';
import {
  EXPECTATION_QUESTIONS,
  EXPERIENCE_QUESTIONS,
  FOOD_OPTIONS,
  GLOSSARY_ITEMS,
  Q1_OPTIONS,
  Q2_OPTIONS,
  Q3_OPTIONS,
  WINE_TYPE_LABELS,
  type ExpectationField,
  type ExperienceField,
  type FoodCategoryId,
  type WineTypeId,
} from '@/features/survey/constants/wine-survey';
import { RANKED_GRAPE_TIER_COPY } from '@/features/survey/constants/ranked-grape-tiers';
import { buildPart2Screens } from '@/features/survey/lib/build-part2-screens';
import {
  computeRecommendation,
  type FullSurveyAnswers,
} from '@/features/survey/lib/compute-recommendation';
import {
  buildRecommendationsListUrl,
} from '@/features/recommendation/lib/recommendation-api';
import {
  useRecommendationDisplayName,
  useRecommendationUserKey,
} from '@/features/recommendation/hooks/use-recommendation-user-id';
import { getOrCreateAnonUserId } from '@/lib/anon-user';
import { cn } from '@/lib/utils';
import type { Part2Screen } from '@/features/survey/types/part2-screen';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { match } from 'ts-pattern';

const STEP1_TOTAL = 3;

export default function SurveyPage() {
  const [phase, setPhase] = useState<'part1' | 'part2' | 'result'>('part1');
  const [part1Step, setPart1Step] = useState(0);

  const [q1Id, setQ1Id] = useState<string | null>(null);
  const [q2Id, setQ2Id] = useState<string | null>(null);
  const [q3Ids, setQ3Ids] = useState<WineTypeId[]>([]);

  const [experience, setExperience] = useState<FullSurveyAnswers['experience']>({});
  const [expectationGeneral, setExpectationGeneral] = useState<
    FullSurveyAnswers['expectationGeneral']
  >({});
  const [foods, setFoods] = useState<string[]>([]);

  const [part2Screens, setPart2Screens] = useState<Part2Screen[]>([]);
  const [part2Index, setPart2Index] = useState(0);

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const recommendationUserKey = useRecommendationUserKey();
  const sessionDisplayName = useRecommendationDisplayName();

  const fullAnswers: FullSurveyAnswers = useMemo(
    () => ({
      q1: q1Id ?? '',
      q2: q2Id ?? '',
      q3: q3Ids,
      experience,
      expectationGeneral,
      foods,
    }),
    [q1Id, q2Id, q3Ids, experience, expectationGeneral, foods],
  );

  const recommendation = useMemo(() => {
    if (phase !== 'result') {
      return null;
    }
    return computeRecommendation(fullAnswers);
  }, [phase, fullAnswers]);

  useEffect(() => {
    if (phase !== 'result') {
      return;
    }

    const anonId = getOrCreateAnonUserId();
    if (!anonId) {
      return;
    }

    let cancelled = false;
    const fetchUsername = async () => {
      try {
        const response = await fetch(buildRecommendationsListUrl(anonId), {
          credentials: 'include',
        });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { username?: string | null };
        if (!cancelled) {
          setUsername(sessionDisplayName ?? payload.username ?? null);
        }
      } catch {
        // 사용자 식별 정보가 없을 수 있으므로 조용히 무시한다.
      }
    };

    void fetchUsername();
    return () => {
      cancelled = true;
    };
  }, [phase, recommendationUserKey, sessionDisplayName]);

  const totalSurveySteps = STEP1_TOTAL + part2Screens.length;
  const activeStepIndex =
    phase === 'part1'
      ? part1Step
      : phase === 'part2'
        ? STEP1_TOTAL + part2Index
        : totalSurveySteps;

  const progress =
    phase === 'result' ? 100 : totalSurveySteps > 0 ? (activeStepIndex / totalSurveySteps) * 100 : 0;

  const progressLabel = match(phase)
    .with('part1', () => `STEP 1 · 설문 ${part1Step + 1}/${STEP1_TOTAL}`)
    .with('part2', () => {
      const screen = part2Screens[part2Index];
      const label = match(screen)
        .with({ kind: 'glossary' }, () => '용어 안내')
        .with({ kind: 'experienceWineIntro' }, () => '경험평가 전환')
        .with({ kind: 'experience' }, () => '경험평가')
        .with({ kind: 'expectationIntro' }, () => '기대 취향 안내')
        .with({ kind: 'expectation' }, () => '기대 취향')
        .with({ kind: 'food' }, () => '음식 취향')
        .exhaustive();
      return `STEP 2~4 · ${label} (${part2Index + 1}/${part2Screens.length})`;
    })
    .with('result', () => '추천 결과')
    .exhaustive();

  const toggleQ3 = (id: WineTypeId) => {
    setQ3Ids((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleFood = (item: string) => {
    setFoods((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  const toggleCategoryAll = (cat: FoodCategoryId) => {
    const items = FOOD_OPTIONS[cat].items;
    setFoods((prev) => {
      const allOn = items.every((itemId) => prev.includes(itemId));
      if (allOn) {
        return prev.filter((f) => !items.includes(f));
      }
      return Array.from(new Set([...prev, ...items]));
    });
  };

  const handlePart1NextFromQ3 = () => {
    const screens = buildPart2Screens(q3Ids);
    setPart2Screens(screens);
    setPart2Index(0);
    setPhase('part2');
  };

  const setExperienceValue = (wine: WineTypeId, field: ExperienceField, value: number) => {
    setExperience((prev) => ({
      ...prev,
      [wine]: { ...prev[wine], [field]: value },
    }));
  };

  const setExpectationGeneralValue = (field: ExpectationField, value: number) => {
    setExpectationGeneral((prev) => ({ ...prev, [field]: value }));
  };

  const advancePart2 = () => {
    if (part2Index < part2Screens.length - 1) {
      setPart2Index((i) => i + 1);
      return;
    }
    setPhase('result');
  };

  const handleBack = () => {
    if (phase === 'part1' && part1Step > 0) {
      setPart1Step((s) => s - 1);
      return;
    }
    if (phase === 'part2' && part2Index > 0) {
      setPart2Index((i) => i - 1);
      return;
    }
    if (phase === 'part2' && part2Index === 0) {
      setPhase('part1');
      setPart1Step(2);
    }
  };

  const handleReset = () => {
    setPhase('part1');
    setPart1Step(0);
    setQ1Id(null);
    setQ2Id(null);
    setQ3Ids([]);
    setExperience({});
    setExpectationGeneral({});
    setFoods([]);
    setPart2Screens([]);
    setPart2Index(0);
    setSaveState('idle');
    setSaveMessage('');
    setUsername(null);
  };

  const handleSaveResult = async () => {
    if (!recommendation) {
      return;
    }

    try {
      setSaveState('saving');
      setSaveMessage('');

      const anonId = getOrCreateAnonUserId();
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          anonId,
          category: recommendation.categoryLabel,
          sweetness: recommendation.sweetnessLabel,
          primaryGrape: recommendation.primaryGrape.nameKo,
          secondaryGrape: recommendation.secondaryGrape.nameKo,
          tertiaryGrape: recommendation.tertiaryGrape.nameKo,
          summary: recommendation.summary,
          reason: recommendation.reason,
          situations: recommendation.situations,
        }),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다.');
      }

      const payload = (await response.json()) as { username?: string | null };
      if (payload.username) {
        setUsername(sessionDisplayName ?? payload.username);
      }

      setSaveState('saved');
      setSaveMessage('결과가 저장되었습니다. 랜딩에서 이전 기록을 확인할 수 있어요.');
    } catch {
      setSaveState('error');
      setSaveMessage('결과 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const currentPart2Screen = part2Screens[part2Index];

  const canGoBack = (phase === 'part1' && part1Step > 0) || phase === 'part2';

  const backLabel =
    phase === 'part2' && part2Index === 0 ? 'STEP 1으로 돌아가기' : '이전';

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 text-stone-800 md:px-8">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-rose-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold text-rose-700 hover:text-rose-800">
            ← 홈으로
          </Link>
          <p className="text-sm text-stone-500">{progressLabel}</p>
        </div>

        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-rose-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {phase === 'part1' && part1Step === 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              STEP 1 · 와인 경험 수준
            </p>
            <h1 className="text-2xl font-bold text-rose-900">
              Q1. 지난 6개월 동안 와인을 얼마나 마셔보셨나요?
            </h1>
            <p className="text-sm text-stone-600">한 가지를 선택해주세요.</p>
            <div className="grid gap-3 pt-2">
              {Q1_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setQ1Id(option.id);
                    setPart1Step(1);
                  }}
                  className={cn(
                    'rounded-2xl border border-stone-200 px-4 py-3 text-left text-sm font-medium transition',
                    'hover:border-rose-300 hover:bg-rose-50',
                    q1Id === option.id && 'border-rose-400 bg-rose-50',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'part1' && part1Step === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              STEP 1 · 와인 경험 수준
            </p>
            <h1 className="text-2xl font-bold text-rose-900">Q2. 기억나는 와인이 있나요?</h1>
            <p className="text-sm text-stone-600">한 가지를 선택해주세요.</p>
            <div className="grid gap-3 pt-2">
              {Q2_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setQ2Id(option.id);
                    setPart1Step(2);
                  }}
                  className={cn(
                    'rounded-2xl border border-stone-200 px-4 py-3 text-left text-sm font-medium transition',
                    'hover:border-rose-300 hover:bg-rose-50',
                    q2Id === option.id && 'border-rose-400 bg-rose-50',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'part1' && part1Step === 2 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              STEP 1 · 와인 경험 수준
            </p>
            <h1 className="text-2xl font-bold text-rose-900">
              Q3. 마셔본 와인 종류를 선택해주세요
            </h1>
            <p className="text-sm text-stone-600">
              복수 선택 가능합니다. 해당 없음이면 아무 것도 선택하지 않으셔도 이후 단계에서 기대 취향만
              물어봅니다.
            </p>
            <div className="grid gap-3 pt-2">
              {Q3_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 transition',
                    'hover:border-rose-300 hover:bg-rose-50',
                    q3Ids.includes(option.id) && 'border-rose-400 bg-rose-50',
                  )}
                >
                  <Checkbox
                    checked={q3Ids.includes(option.id)}
                    onCheckedChange={() => toggleQ3(option.id)}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setPart1Step(1)}
              >
                이전
              </Button>
              <Button
                type="button"
                className="rounded-full bg-rose-700 px-6 text-white hover:bg-rose-800"
                onClick={handlePart1NextFromQ3}
              >
                다음 단계
              </Button>
            </div>
          </div>
        )}

        {phase === 'part2' && currentPart2Screen && (
          <div className="space-y-6">
            {match(currentPart2Screen)
              .with({ kind: 'glossary' }, () => (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                      공통 안내 · 용어 설명
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-rose-900">평가 전에 알아두면 좋아요</h2>
                    <p className="mt-2 text-sm text-stone-600">
                      이후 질문에서 같은 기준으로 당도·산도·타닌·바디·향을 평가합니다.
                    </p>
                  </div>
                  <ul className="space-y-4 rounded-2xl border border-stone-100 bg-stone-50/80 p-5">
                    {GLOSSARY_ITEMS.map((item) => (
                      <li key={item.term}>
                        <p className="font-semibold text-stone-900">{item.term}</p>
                        <p className="mt-1 text-sm text-stone-600">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50/40 p-4 text-sm text-stone-700">
                    <p className="font-semibold text-rose-900">향 스타일 예시</p>
                    <p className="mt-2">
                      <span className="font-medium text-stone-800">Fresh</span>: 청사과, 레몬, 딸기, 꽃향
                    </p>
                    <p className="mt-1">
                      <span className="font-medium text-stone-800">Rich</span>: 바닐라, 버터, 토스트, 견과류,
                      오크
                    </p>
                  </div>
                </>
              ))
              .with({ kind: 'experienceWineIntro' }, ({ wine }) => {
                const wineLabel = WINE_TYPE_LABELS[wine];
                return (
                  <Card className="border-rose-200 bg-gradient-to-b from-rose-50/90 to-white shadow-sm">
                    <CardHeader className="pb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                        경험평가 · 다음 종류
                      </p>
                      <CardTitle className="text-xl text-rose-950 md:text-2xl">
                        이제 {wineLabel} 경험평가를 이어갑니다.
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        경험했던 {wineLabel}에 대해 당도·산도·타닌·바디·향을 같은 기준으로 평가합니다.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-stone-600">
                      직전 종류와 동일한 질문이 반복되며, 종류마다 느낌을 떠올려 답해 주세요.
                    </CardContent>
                  </Card>
                );
              })
              .with({ kind: 'expectationIntro' }, () => (
                <Card className="border-rose-200 bg-gradient-to-b from-rose-50/90 to-white shadow-sm">
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                      다음 단계
                    </p>
                    <CardTitle className="text-xl text-rose-950 md:text-2xl">
                      이제 기대하는 취향을 확인합니다.
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      아직 마셔보지 않은 종류들에 공통으로 적용할 당도·산도·타닌·바디·향을 한 번만
                      확인합니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-stone-600">
                    잠시만 시간을 내어 주시면 추천 정확도가 높아집니다.
                  </CardContent>
                </Card>
              ))
              .with({ kind: 'experience' }, ({ wine, field }) => {
                const meta = EXPERIENCE_QUESTIONS[field];
                const value = experience[wine]?.[field];
                const wineLabel = WINE_TYPE_LABELS[wine];
                const questionTitle = meta.title.replace(/^그 와인의/, `경험했던 ${wineLabel}의`);
                return (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-rose-600">경험평가</p>
                      <h2 className="mt-2 text-2xl font-bold text-rose-900">{questionTitle}</h2>
                      {meta.hint && <p className="mt-2 text-sm text-stone-500">{meta.hint}</p>}
                      <p className="mt-2 text-sm text-stone-600">1~5 척도 중 가장 가까운 것을 선택해주세요.</p>
                    </div>
                    <div className="grid gap-2">
                      {meta.labels.map((label, idx) => {
                        const n = idx + 1;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              setExperienceValue(wine, field, n);
                              advancePart2();
                            }}
                            className={cn(
                              'flex gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-left text-sm transition',
                              'hover:border-rose-300 hover:bg-rose-50',
                              value === n && 'border-rose-400 bg-rose-50',
                            )}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-700">
                              {n}
                            </span>
                            <span className="font-medium leading-snug">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })
              .with({ kind: 'expectation' }, ({ field }) => {
                const meta = EXPECTATION_QUESTIONS[field];
                const value = expectationGeneral[field];
                return (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-rose-600">
                        아직 경험하지 않은 와인 종 · 기대 취향 (공통)
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-rose-900">{meta.title}</h2>
                      <p className="mt-2 text-sm text-stone-600">
                        마셔보지 않은 종류 전체에 적용되는 답입니다. 1~5 척도 중 가장 가까운 것을
                        선택해주세요.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {meta.labels.map((label, idx) => {
                        const n = idx + 1;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              setExpectationGeneralValue(field, n);
                              advancePart2();
                            }}
                            className={cn(
                              'flex gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-left text-sm transition',
                              'hover:border-rose-300 hover:bg-rose-50',
                              value === n && 'border-rose-400 bg-rose-50',
                            )}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-700">
                              {n}
                            </span>
                            <span className="font-medium leading-snug">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })
              .with({ kind: 'food' }, () => (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                      STEP 4 · 음식 취향
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-rose-900">
                      Q14. 어떤 음식과 함께 와인을 즐기고 싶나요?
                    </h2>
                    <p className="text-sm text-stone-600">복수 선택 가능합니다.</p>
                  </div>
                  {(Object.keys(FOOD_OPTIONS) as FoodCategoryId[]).map((cat) => {
                    const categoryItems = FOOD_OPTIONS[cat].items;
                    const selectedInCategory = categoryItems.filter((item) => foods.includes(item)).length;
                    const selectAllState =
                      selectedInCategory === 0
                        ? false
                        : selectedInCategory === categoryItems.length
                          ? true
                          : 'indeterminate';

                    return (
                    <div key={cat} className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-2">
                        <p className="text-sm font-semibold text-stone-800">{FOOD_OPTIONS[cat].title}</p>
                        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-stone-600">
                          <span>모두선택</span>
                          <Checkbox
                            checked={selectAllState}
                            onCheckedChange={() => toggleCategoryAll(cat)}
                            aria-label={`${FOOD_OPTIONS[cat].title} 모두선택`}
                          />
                        </label>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {FOOD_OPTIONS[cat].items.map((item) => (
                          <label
                            key={item}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm transition',
                              'hover:border-rose-200 hover:bg-rose-50/60',
                              foods.includes(item) && 'border-rose-400 bg-rose-50',
                            )}
                          >
                            <Checkbox
                              checked={foods.includes(item)}
                              onCheckedChange={() => toggleFood(item)}
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                    );
                  })}
                  <Button
                    type="button"
                    className="w-full rounded-full bg-rose-700 py-6 text-white hover:bg-rose-800 sm:w-auto"
                    onClick={() => setPhase('result')}
                  >
                    결과 보기
                  </Button>
                </>
              ))
              .exhaustive()}

            <div className="flex flex-wrap gap-3 pt-2">
              {canGoBack && (
                <Button type="button" variant="outline" className="rounded-full" onClick={handleBack}>
                  {backLabel}
                </Button>
              )}
              {(currentPart2Screen?.kind === 'glossary' ||
                currentPart2Screen?.kind === 'expectationIntro' ||
                currentPart2Screen?.kind === 'experienceWineIntro') && (
                <Button
                  type="button"
                  className="rounded-full bg-rose-700 px-6 text-white hover:bg-rose-800"
                  onClick={advancePart2}
                >
                  {currentPart2Screen?.kind === 'glossary' ? '시작하기' : '다음'}
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === 'result' && recommendation && (
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                STEP 5 · 추천 결과
              </p>
              <p className="text-xs text-stone-500">
                현재 추천결과는 {RECOMMENDATION_HISTORY_RETENTION_DAYS}일간 저장 후 삭제됩니다.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-rose-900">
                {username ? `${username}의 취향 요약` : '당신의 취향 요약'}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {recommendation.styleTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-800"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-stone-600">
                프로파일: 당도·산도·타닌·바디·향 스타일을 설문 응답으로 평균 내어 계산했습니다.
              </p>
            </div>

            <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
              <h3 className="text-lg font-semibold text-rose-900">{recommendation.summary}</h3>
              <p className="mt-2 text-sm text-stone-700">{recommendation.reason}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    추천 품종 (와인 종류별 · 1~3차)
                  </p>
                  <ul className="mt-3 space-y-3">
                    {RANKED_GRAPE_TIER_COPY.map((meta, i) => {
                      const grape = [recommendation.primaryGrape, recommendation.secondaryGrape, recommendation.tertiaryGrape][i];
                      const styleHint = recommendation.styleHints[i];
                      if (!grape || styleHint === undefined) {
                        return null;
                      }
                      return (
                      <li
                        key={grape.id}
                        className="rounded-xl border border-rose-100/80 bg-white/70 p-3 shadow-sm"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs font-semibold text-rose-800">{meta.tier}</p>
                          <p className="text-[11px] text-stone-500">{meta.hint}</p>
                        </div>
                        <p className="mt-2 text-xs font-medium text-stone-500">
                          종류 ·{' '}
                          <span className="text-stone-800">
                            {WINE_TYPE_LABELS[grape.category]}
                          </span>
                        </p>
                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {grape.nameKo}{' '}
                          <span className="font-normal text-stone-500">({grape.nameEn})</span>
                        </p>
                        <p className="mt-2 text-sm text-stone-700">
                          <span className="font-medium text-stone-600">스타일 ·</span> {styleHint}
                        </p>
                      </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    추천 음식 (설문·품종 데이터 교차)
                  </p>
                  {recommendation.matchedFoods.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {recommendation.matchedFoods.map((f) => (
                        <li
                          key={f}
                          className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-stone-800 ring-1 ring-rose-100"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-stone-600">
                      음식을 선택하지 않았거나 교차 매칭이 없습니다. 상황별로 아래를 참고해 보세요.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    함께하면 좋은 상황
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-stone-700">
                    {recommendation.situations.map((item) => (
                      <li key={item}>— {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSaveResult}
                disabled={saveState === 'saving' || saveState === 'saved'}
                className="rounded-full bg-emerald-700 px-6 text-white hover:bg-emerald-800 disabled:bg-emerald-500"
              >
                {saveState === 'saving' ? '저장 중...' : saveState === 'saved' ? '저장 완료' : '결과 저장하기'}
              </Button>
              <Button onClick={handleReset} className="rounded-full bg-rose-700 px-6 text-white hover:bg-rose-800">
                설문 다시하기
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">홈으로</Link>
              </Button>
            </div>
            {saveMessage && (
              <p
                className={cn(
                  'text-sm',
                  saveState === 'error' ? 'text-red-600' : 'text-emerald-700',
                )}
              >
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
