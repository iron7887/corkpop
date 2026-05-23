import type {
  ExpectationField,
  ExperienceField,
  WineTypeId,
} from '@/features/survey/constants/wine-survey';
import { WINE_TYPE_IDS, WINE_TYPE_LABELS } from '@/features/survey/constants/wine-survey';
import { GRAPE_CATALOG, type GrapeProfile } from '@/features/survey/lib/grape-catalog';

export type FullSurveyAnswers = {
  q1: string;
  q2: string;
  q3: WineTypeId[];
  experience: Partial<Record<WineTypeId, Partial<Record<ExperienceField, number>>>>;
  /** 아직 마셔보지 않은 종에 공통으로 적용하는 기대 취향(5문항 1회) */
  expectationGeneral: Partial<Record<ExpectationField, number>>;
  foods: string[];
};

export type UserFlavorVector = {
  sweetness: number;
  tannin: number;
  body: number;
  acidity: number;
  aromaStyle: number;
};

export type WineRecommendation = {
  primaryGrape: GrapeProfile;
  secondaryGrape: GrapeProfile;
  tertiaryGrape: GrapeProfile;
  styleTags: string[];
  styleHints: string[];
  categoryLabel: string;
  sweetnessLabel: string;
  summary: string;
  reason: string;
  situations: string[];
  matchedFoods: string[];
  profile: UserFlavorVector;
};

const mean = (values: number[]): number => {
  if (values.length === 0) {
    return 3;
  }
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const collectNumbers = (
  answers: FullSurveyAnswers,
  expKey: ExperienceField,
  expKeyAlt: ExpectationField,
): number[] => {
  const out: number[] = [];
  WINE_TYPE_IDS.forEach((id) => {
    const e = answers.experience[id]?.[expKey];
    if (typeof e === 'number') {
      out.push(e);
    }
  });
  const g = answers.expectationGeneral[expKeyAlt];
  if (typeof g === 'number') {
    out.push(g);
  }
  return out;
};

export const buildUserVector = (answers: FullSurveyAnswers): UserFlavorVector => {
  const sweetness = mean(collectNumbers(answers, 'sweetness', 'sweetness'));
  const tannin = mean(collectNumbers(answers, 'tannin', 'tannin'));
  const body = mean(collectNumbers(answers, 'body', 'body'));
  const acidity = mean(collectNumbers(answers, 'acidity', 'acidity'));
  const aromaStyle = mean(collectNumbers(answers, 'aromaStyle', 'aromaStyle'));
  return { sweetness, tannin, body, acidity, aromaStyle };
};

const squaredDistance = (g: GrapeProfile, u: UserFlavorVector): number => {
  const ds = g.sweetness - u.sweetness;
  const dt = g.tannin - u.tannin;
  const db = g.body - u.body;
  const dac = g.acidity - u.acidity;
  const da = g.aromaStyle - u.aromaStyle;
  return ds * ds + dt * dt + db * db + dac * dac + da * da;
};

const foodOverlapScore = (grape: GrapeProfile, foods: Set<string>): number => {
  let n = 0;
  grape.foods.forEach((f) => {
    if (foods.has(f)) {
      n += 1;
    }
  });
  return n * 5;
};

const categoryBoost = (grape: GrapeProfile, answers: FullSurveyAnswers): number => {
  const tried = new Set(answers.q3);
  const boostTried = tried.has(grape.category) ? 1.15 : 1;
  const hasGeneralExpectation =
    typeof answers.expectationGeneral.sweetness === 'number' ||
    typeof answers.expectationGeneral.tannin === 'number' ||
    typeof answers.expectationGeneral.acidity === 'number';
  const boostExp =
    !tried.has(grape.category) && hasGeneralExpectation ? 1.05 : 1;
  return boostTried * boostExp;
};

const buildStyleTags = (u: UserFlavorVector): string[] => {
  const tags: string[] = [];
  if (u.sweetness <= 2.2) {
    tags.push('드라이');
  } else if (u.sweetness >= 3.8) {
    tags.push('달콤한 스타일');
  } else {
    tags.push('중간 당도');
  }

  if (u.body <= 2.2) {
    tags.push('라이트 바디');
  } else if (u.body >= 3.8) {
    tags.push('풀 바디');
  } else {
    tags.push('미디엄 바디');
  }

  if (u.tannin <= 2.2) {
    tags.push('부드러운 타닌');
  } else if (u.tannin >= 3.8) {
    tags.push('구조감·타닌');
  } else {
    tags.push('밸런스 타닌');
  }

  if (u.aromaStyle <= 2.2) {
    tags.push('Fresh Fruit Aroma');
  } else if (u.aromaStyle >= 3.8) {
    tags.push('오크·숙성 향');
  } else {
    tags.push('과일·오크 균형');
  }

  if (u.acidity <= 2.2) {
    tags.push('낮은 산도');
  } else if (u.acidity >= 3.8) {
    tags.push('산도(신 맛·침 고임) 선호');
  } else {
    tags.push('중간 산도');
  }

  return tags;
};

const sweetnessApiLabel = (u: UserFlavorVector): string => {
  if (u.sweetness <= 2) {
    return '드라이';
  }
  if (u.sweetness <= 3) {
    return '세미 드라이';
  }
  if (u.sweetness <= 4) {
    return '세미 스위트';
  }
  return '스위트';
};

export const computeRecommendation = (answers: FullSurveyAnswers): WineRecommendation => {
  const profile = buildUserVector(answers);
  const foodSet = new Set(answers.foods);
  const styleTags = buildStyleTags(profile);

  const scored = GRAPE_CATALOG.map((g) => {
    const dist = squaredDistance(g, profile);
    const food = foodOverlapScore(g, foodSet);
    const cat = categoryBoost(g, answers);
    const score = -dist + food * cat;
    return { grape: g, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const primaryGrape = scored[0]?.grape ?? GRAPE_CATALOG[0];
  const secondaryGrape =
    scored.find((s) => s.grape.id !== primaryGrape.id)?.grape ?? GRAPE_CATALOG[1];
  const tertiaryGrape =
    scored.find((s) => s.grape.id !== primaryGrape.id && s.grape.id !== secondaryGrape.id)?.grape ??
    GRAPE_CATALOG[2];

  const matchedFoods = answers.foods.filter((f) =>
    [primaryGrape, secondaryGrape].some((g) => g.foods.includes(f)),
  );

  const styleHints = [primaryGrape.styleHint, secondaryGrape.styleHint, tertiaryGrape.styleHint];

  const summary = `${styleTags.slice(0, 3).join(' · ')} 취향`;

  const reasonParts = [
    `설문에서 정리한 당도·산도·타닌·바디·향 스타일 선호와 가장 잘 맞는 품종입니다.`,
    answers.foods.length > 0
      ? `선택하신 음식(${answers.foods.slice(0, 3).join(', ')}${answers.foods.length > 3 ? '…' : ''})과 어울리는 페어링을 가중했습니다.`
      : '음식 페어링 정보 없이 순수 취향 프로파일만 반영했습니다.',
  ];

  const situations =
    matchedFoods.length > 0
      ? matchedFoods.slice(0, 5)
      : ['저녁 식사', '가벼운 모임', '페어링 탐색'];

  return {
    primaryGrape,
    secondaryGrape,
    tertiaryGrape,
    styleTags,
    styleHints,
    categoryLabel: WINE_TYPE_LABELS[primaryGrape.category],
    sweetnessLabel: sweetnessApiLabel(profile),
    summary,
    reason: reasonParts.join(' '),
    situations,
    matchedFoods,
    profile,
  };
};
