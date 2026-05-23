export const WINE_TYPE_IDS = ['red', 'white', 'sparkling', 'rose', 'sweet'] as const;

export type WineTypeId = (typeof WINE_TYPE_IDS)[number];

export const WINE_TYPE_LABELS: Record<WineTypeId, string> = {
  red: '레드 와인',
  white: '화이트 와인',
  sparkling: '스파클링 와인',
  rose: '로제 와인',
  sweet: '스위트 와인',
};

export const Q1_OPTIONS = [
  { id: 'q1_a', label: '처음이거나 거의 없음' },
  { id: 'q1_b', label: '1~2번' },
  { id: 'q1_c', label: '3~5번' },
  { id: 'q1_d', label: '월 1~2회' },
  { id: 'q1_e', label: '주 1회 이상' },
] as const;

export const Q2_OPTIONS = [
  { id: 'q2_yes', label: '있다' },
  { id: 'q2_vague', label: '이름은 모르지만 기억나는 와인이 있다' },
  { id: 'q2_no', label: '없다' },
] as const;

export const Q3_OPTIONS: Array<{ id: WineTypeId; label: string }> = [
  { id: 'red', label: '레드 와인' },
  { id: 'white', label: '화이트 와인' },
  { id: 'sparkling', label: '스파클링 와인' },
  { id: 'rose', label: '로제 와인' },
  { id: 'sweet', label: '스위트 와인' },
];

export type ExperienceField =
  | 'sweetness'
  | 'tannin'
  | 'body'
  | 'acidity'
  | 'aromaStyle'
  | 'aromaLike';

export type ExpectationField =
  | 'sweetness'
  | 'tannin'
  | 'body'
  | 'acidity'
  | 'aromaStyle'
  | 'aromaIntensity';

export const EXPERIENCE_FIELD_ORDER: ExperienceField[] = [
  'sweetness',
  'tannin',
  'body',
  'acidity',
  'aromaStyle',
  'aromaLike',
];

export const EXPECTATION_FIELD_ORDER: ExpectationField[] = [
  'sweetness',
  'tannin',
  'body',
  'acidity',
  'aromaStyle',
  'aromaIntensity',
];

export const EXPERIENCE_QUESTIONS: Record<
  ExperienceField,
  { title: string; hint?: string; labels: [string, string, string, string, string] }
> = {
  sweetness: {
    title: '그 와인의 당도는 어땠나요?',
    labels: ['전혀 달지 않았다', '약간 드라이했다', '적당했다', '조금 달았다', '매우 달았다'],
  },
  tannin: {
    title: '그 와인의 타닌은 어땠나요?',
    hint: '입안이 떫거나 마르는 느낌 (화이트·스파클링·일부 로제는 낮게 느껴질 수 있어요)',
    labels: ['전혀 없었다', '거의 없었다', '조금 느껴졌다', '꽤 강했다', '매우 강했다'],
  },
  body: {
    title: '그 와인의 바디감은 어땠나요?',
    labels: ['매우 가벼웠다', '가벼운 편', '중간', '묵직한 편', '매우 진하고 무거웠다'],
  },
  acidity: {
    title: '그 와인의 산도는 어땠나요?',
    hint: '신 맛, 와인을 머금었을 때 입안에 침이 고이는 정도가 얼마나 느껴졌는지',
    labels: [
      '거의 느껴지지 않았다',
      '낮은 편이었다',
      '적당했다',
      '높은 편이었다 (침이 꽤 고이는 느낌)',
      '매우 높았다 (침이 많이 고이는 편)',
    ],
  },
  aromaStyle: {
    title: '그 와인의 향 스타일은 어땠나요?',
    labels: [
      '아주 신선하고 과일 같았다',
      '과일향 중심이지만 약간 깊이감 있었다',
      '과일향과 묵직한 향이 균형적이었다',
      '오크/버터/구운 느낌이 꽤 있었다',
      '숙성된 나무향, 견과류, 브리오슈 느낌이 강했다',
    ],
  },
  aromaLike: {
    title: '그 와인의 향은 얼마나 마음에 들었나요?',
    labels: ['매우 싫었다', '별로였다', '보통', '좋았다', '매우 좋았다'],
  },
};

export const EXPECTATION_QUESTIONS: Record<
  ExpectationField,
  { title: string; labels: [string, string, string, string, string] }
> = {
  sweetness: {
    title: '기대하는 당도는 어느 정도인가요?',
    labels: ['매우 드라이', '드라이', '중간', '약간 달콤', '매우 달콤'],
  },
  tannin: {
    title: '기대하는 타닌은 어느 정도인가요?',
    labels: ['전혀 없음', '약간', '중간', '강한 편', '매우 강함'],
  },
  body: {
    title: '기대하는 바디감은 어느 정도인가요?',
    labels: ['매우 가벼움', '가벼움', '중간', '묵직함', '매우 묵직함'],
  },
  acidity: {
    title: '기대하는 산도는 어느 정도인가요?',
    labels: [
      '매우 낮게',
      '낮게',
      '중간',
      '높게',
      '매우 높게 (머금었을 때 침이 많이 고이는 편)',
    ],
  },
  aromaStyle: {
    title: '어떤 향 스타일이 끌리나요?',
    labels: [
      '신선한 과일향 중심',
      '상큼하고 가벼운 향',
      '과일 + 스파이스 균형',
      '바닐라 / 버터 같은 깊은 향',
      '숙성된 오크 / 브리오슈 느낌',
    ],
  },
  aromaIntensity: {
    title: '향이 얼마나 강했으면 좋겠나요?',
    labels: ['거의 은은하게', '약한 편', '적당히 풍부하게', '향이 강한 편', '매우 강렬하게'],
  },
};

export type FoodCategoryId = 'meat' | 'seafood' | 'korean' | 'dessert';

export const FOOD_OPTIONS: Record<FoodCategoryId, { title: string; items: string[] }> = {
  meat: {
    title: '육류',
    items: ['스테이크', '바비큐', '양갈비', '치킨', '햄버거'],
  },
  seafood: {
    title: '해산물',
    items: ['회', '굴', '조개', '새우', '해물파전'],
  },
  korean: {
    title: '한식',
    items: [
      '불고기',
      '갈비찜',
      '제육볶음',
      '닭갈비',
      '육전',
      '잡채',
      '김치찜',
      '떡볶이',
      '보쌈',
      '전',
      '닭강정',
    ],
  },
  dessert: {
    title: '디저트',
    items: ['초콜릿', '케이크', '과일', '한과', '약과'],
  },
};

export const GLOSSARY_ITEMS = [
  {
    term: '당도 (Sweetness)',
    desc: '단맛의 정도',
  },
  {
    term: '타닌 (Tannin)',
    desc: '떫은 감처럼 입안이 마르는 느낌',
  },
  {
    term: '바디 (Body)',
    desc: '물처럼 가벼운지, 우유처럼 묵직한지',
  },
  {
    term: '산도 (Acidity)',
    desc: '신 맛, 와인을 머금었을 때 입안에 침이 고이는 정도',
  },
  {
    term: '숙성 향 스타일 (Aging Style)',
    desc: '신선한 과일향인지, 오크·버터·견과류 같은 숙성향인지',
  },
] as const;
