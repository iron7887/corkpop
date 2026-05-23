import { RECOMMENDATION_HISTORY_RETENTION_DAYS } from '@/constants/recommendation-history';
import { addDays, differenceInCalendarDays, format } from 'date-fns';

/**
 * 비회원 추천 기록의 만료 시점과 남은 일수를 계산한다.
 * 만료일 = 저장일(created_at) + 보관 기간(7일)
 */
export const getRecommendationRetentionInfo = (createdAt: string | Date) => {
  const createdDate = new Date(createdAt);
  const expiresAt = addDays(createdDate, RECOMMENDATION_HISTORY_RETENTION_DAYS);
  const remainingDays = differenceInCalendarDays(expiresAt, new Date());

  return {
    expiresAt,
    remainingDays,
    isExpired: remainingDays < 0,
  };
};

/**
 * 카드에 표시할 "유효기간: YYYY-MM-DD까지 (N일 남음)" 문자열을 만든다.
 */
export const formatRetentionLabel = (createdAt: string | Date) => {
  const { expiresAt, remainingDays, isExpired } = getRecommendationRetentionInfo(createdAt);
  const expiresAtLabel = format(expiresAt, 'yyyy-MM-dd');

  if (isExpired) {
    return `유효기간: ${expiresAtLabel}까지 (만료됨)`;
  }

  if (remainingDays === 0) {
    return `유효기간: ${expiresAtLabel}까지 (오늘 만료)`;
  }

  return `유효기간: ${expiresAtLabel}까지 (${remainingDays}일 남음)`;
};
