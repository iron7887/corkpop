export const oldWorldCountries = [
  { country: '프랑스', trait: '세계 와인 기준이 되는 국가', region: '보르도, 부르고뉴, 샹파뉴' },
  { country: '이탈리아', trait: '다양한 품종과 지역성', region: '토스카나, 피에몬테' },
  { country: '스페인', trait: '숙성 중심 와인 문화', region: '리오하, 리베라 델 두에로' },
  { country: '독일', trait: '산도 높은 화이트 와인 강점', region: '모젤, 라인가우' },
  { country: '포르투갈', trait: '포트와인 등 주정강화 와인 유명', region: '도우루' },
  { country: '오스트리아', trait: '미네랄감 있는 화이트 와인', region: '바하우' },
  { country: '그리스', trait: '고대 와인 문화 보유', region: '산토리니' },
] as const;

export const oldWorldTraits = [
  '산도와 균형감 중심',
  '음식과 함께 마시는 스타일',
  '지역 이름 중심 레이블 사용',
  '전통 규정 엄격',
] as const;

export const newWorldCountries = [
  { country: '미국', trait: '진한 과실향과 현대적 스타일', region: '나파 밸리, 소노마' },
  { country: '칠레', trait: '가성비 우수', region: '마이포 밸리' },
  { country: '아르헨티나', trait: '말벡 품종 유명', region: '멘도사' },
  { country: '호주', trait: '강렬한 쉬라즈 스타일', region: '바로사 밸리' },
  { country: '뉴질랜드', trait: '소비뇽 블랑 세계적 명성', region: '말보로' },
  { country: '남아프리카공화국', trait: '유럽+신대륙 스타일 혼합', region: '스텔렌보스' },
] as const;

export const newWorldTraits = [
  '과실향 강조',
  '알코올 도수 비교적 높음',
  '품종 중심 레이블 사용',
  '접근성이 좋음',
] as const;

export const wineKinds = [
  {
    id: 'red',
    title: '레드 와인 (Red Wine)',
    lead: '붉은 포도 껍질과 함께 발효한 와인.',
    traits: ['탄닌 존재', '바디감 강함', '검붉은 과실 향'],
    aromas: ['체리', '블랙베리', '자두', '초콜릿', '가죽', '오크'],
    traitHeading: '특징',
    aromaHeading: '대표 향',
  },
  {
    id: 'white',
    title: '화이트 와인 (White Wine)',
    lead: '청포도 또는 적포도의 껍질을 제거 후 만든 와인.',
    traits: ['산도 높음', '가볍고 신선함', '차갑게 마심'],
    aromas: ['사과', '레몬', '복숭아', '꽃향', '허브'],
    traitHeading: '특징',
    aromaHeading: '대표 향',
  },
  {
    id: 'rose',
    title: '로제 와인 (Rosé Wine)',
    lead: '포도 껍질 접촉 시간을 짧게 하여 만든 분홍빛 와인.',
    traits: ['레드와 화이트 중간 스타일', '산뜻하고 과실감 풍부'],
    aromas: ['딸기', '라즈베리', '수박', '장미'],
    traitHeading: '특징',
    aromaHeading: '대표 향',
  },
  {
    id: 'sparkling',
    title: '스파클링 와인 (Sparkling Wine)',
    lead: '탄산이 포함된 와인.',
    traits: ['청량감', '축하용 이미지', '높은 산도'],
    aromas: ['샴페인', '프로세코', '카바'],
    traitHeading: '특징',
    aromaHeading: '대표 종류',
  },
  {
    id: 'fortified',
    title: '주정강화 와인 (Fortified Wine)',
    lead: '발효 중 혹은 이후에 증류주를 추가한 와인.',
    traits: ['높은 도수', '달콤하거나 농축된 풍미', '숙성향 발달'],
    aromas: ['포트와인', '셰리', '마데이라'],
    traitHeading: '특징',
    aromaHeading: '대표 종류',
  },
] as const;

export const redGrapeProfiles = [
  {
    name: '카베르네 소비뇽 (Cabernet Sauvignon)',
    rows: [
      { label: '대표 국가', value: '프랑스, 미국' },
      { label: '특징', value: '탄닌 강함, 묵직한 바디' },
      { label: '대표 향', value: '블랙커런트, 삼나무, 담배' },
    ],
  },
  {
    name: '메를로 (Merlot)',
    rows: [
      { label: '대표 국가', value: '프랑스' },
      { label: '특징', value: '부드럽고 둥근 질감' },
      { label: '대표 향', value: '자두, 초콜릿' },
    ],
  },
  {
    name: '피노 누아 (Pinot Noir)',
    rows: [
      { label: '대표 국가', value: '프랑스, 뉴질랜드' },
      { label: '특징', value: '섬세하고 우아함' },
      { label: '대표 향', value: '체리, 버섯, 흙' },
    ],
  },
  {
    name: '쉬라즈 / 시라 (Shiraz / Syrah)',
    rows: [
      { label: '대표 국가', value: '호주, 프랑스' },
      { label: '특징', value: '스파이시하고 진함' },
      { label: '대표 향', value: '후추, 블랙베리' },
    ],
  },
  {
    name: '말벡 (Malbec)',
    rows: [
      { label: '대표 국가', value: '아르헨티나' },
      { label: '특징', value: '진한 과실감' },
      { label: '대표 향', value: '블랙플럼, 코코아' },
    ],
  },
] as const;

export const whiteGrapeProfiles = [
  {
    name: '샤르도네 (Chardonnay)',
    rows: [
      { label: '대표 국가', value: '프랑스, 미국' },
      { label: '특징', value: '양조 스타일 다양' },
      { label: '대표 향', value: '버터, 바닐라, 사과' },
    ],
  },
  {
    name: '소비뇽 블랑 (Sauvignon Blanc)',
    rows: [
      { label: '대표 국가', value: '뉴질랜드' },
      { label: '특징', value: '산도 높고 허브향 강함' },
      { label: '대표 향', value: '풀향, 자몽, 라임' },
    ],
  },
  {
    name: '리슬링 (Riesling)',
    rows: [
      { label: '대표 국가', value: '독일' },
      { label: '특징', value: '높은 산도와 당도 균형' },
      { label: '대표 향', value: '복숭아, 라임, 석유향' },
    ],
  },
  {
    name: '슈냉블랑 (Chenin Blanc)',
    rows: [
      { label: '대표 국가', value: '프랑스, 남아프리카공화국' },
      { label: '특징', value: '드라이부터 스위트까지 다양한 스타일' },
      { label: '대표 향', value: '사과, 배, 꿀, 카모마일' },
    ],
  },
  {
    name: '게뷔르츠트라미너 (Gewürztraminer)',
    rows: [
      { label: '대표 국가', value: '프랑스, 독일' },
      { label: '특징', value: '화려한 아로마와 낮은 산도' },
      { label: '대표 향', value: '리치, 장미, 열대과일, 향신료' },
    ],
  },
  {
    name: '그뤼너벨트리너 (Grüner Veltliner)',
    rows: [
      { label: '대표 국가', value: '오스트리아' },
      { label: '특징', value: '산도와 미네랄감이 뛰어남' },
      { label: '대표 향', value: '청사과, 라임, 흰후추, 허브' },
    ],
  },
] as const;

export const sparklingGrapes = [
  { variety: '샤르도네', country: '프랑스', trait: '산도와 우아함' },
  { variety: '피노 누아', country: '프랑스', trait: '구조감' },
  { variety: '피노 뫼니에', country: '프랑스', trait: '과실향 강조' },
  { variety: '글레라', country: '이탈리아', trait: '프로세코 핵심 품종' },
] as const;

export const roseGrapes = [
  { variety: '그르나슈', country: '프랑스, 스페인', trait: '딸기향 풍부' },
  { variety: '생소', country: '프랑스', trait: '가볍고 산뜻' },
  { variety: '무르베드르', country: '프랑스', trait: '스파이시함' },
] as const;

export const fortifiedGrapes = [
  { variety: '투리가 나시오날', country: '포르투갈', trait: '포트와인 핵심' },
  { variety: '팔로미노', country: '스페인', trait: '셰리 생산' },
  { variety: '세르시알', country: '포르투갈', trait: '마데이라 생산' },
] as const;

export const labelBasics = [
  { term: '생산자(Producer)', meaning: '와이너리 이름' },
  { term: '지역(Appellation)', meaning: '포도 재배 지역' },
  { term: '빈티지(Vintage)', meaning: '포도 수확 연도' },
  { term: '품종(Grape Variety)', meaning: '사용 포도 품종' },
  { term: '알코올 도수(ABV)', meaning: '알코올 함량' },
  { term: '용량(Volume)', meaning: '병 용량' },
] as const;

export const labelTerms = [
  { term: 'Reserve', meaning: '특별 숙성 또는 상위급' },
  { term: 'Grand Cru', meaning: '최고 등급 포도밭' },
  { term: 'Estate Bottled', meaning: '자가 포도밭 생산' },
  { term: 'DOC / DOCG', meaning: '이탈리아 원산지 등급' },
  { term: 'AOC / AOP', meaning: '프랑스 원산지 등급' },
  { term: 'Brut', meaning: '드라이한 스파클링 와인' },
  { term: 'Vintage', meaning: '수확 연도 표기' },
] as const;

export const beginnerSteps = [
  '좋아하는 와인 종류 찾기',
  '좋아하는 품종 찾기',
  '생산국 스타일 비교하기',
  '레이블 읽기 익숙해지기',
  '음식 페어링 시도하기',
] as const;

export const navItems = [
  { id: 'wine-regions', label: '생산국' },
  { id: 'wine-types', label: '와인 종류' },
  { id: 'grape-varieties', label: '품종' },
  { id: 'wine-labels', label: '레이블' },
  { id: 'beginner-path', label: '초보 팁' },
] as const;
