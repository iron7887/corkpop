const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=80`;

const WINE_GLASS_BACKGROUNDS: Array<{ suffix: string; url: string }> = [
  {
    suffix: '스파클링 와인',
    url: unsplash('photo-1546171753-97d7676e4602'),
  },
  {
    suffix: '화이트 와인',
    url: unsplash('photo-1516594915697-87eb3b1c14ea'),
  },
  {
    suffix: '레드 와인',
    url: unsplash('photo-1510812431401-41d2bd2722f3'),
  },
  {
    suffix: '로제 와인',
    url: unsplash('photo-1551538827-9c037cb4f32a'),
  },
  {
    suffix: '스위트 와인',
    url: unsplash('photo-1568213816046-0ee1c42bd559'),
  },
];

const DEFAULT_WINE_GLASS_BG = unsplash('photo-1470337458703-46ad1756a187');

export function getRecommendationCardBackgroundUrl(recommendedType: string): string {
  const match = WINE_GLASS_BACKGROUNDS.find(({ suffix }) => recommendedType.endsWith(suffix));
  return match?.url ?? DEFAULT_WINE_GLASS_BG;
}
