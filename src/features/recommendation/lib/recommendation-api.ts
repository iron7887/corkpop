export const buildRecommendationsListUrl = (anonId: string) => {
  const params = new URLSearchParams({ anonId });
  return `/api/recommendations?${params.toString()}`;
};

export const buildRecommendationItemUrl = (id: string, anonId: string) => {
  const params = new URLSearchParams({ anonId });
  return `/api/recommendations/${id}?${params.toString()}`;
};

export const mergeGuestHistoryOnAuth = async (anonId: string) => {
  const response = await fetch('/api/account/merge-guest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ anonId }),
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as { merged?: boolean };
  return payload.merged === true;
};
