import type { FullSurveyAnswers } from '@/features/survey/lib/compute-recommendation';
import type { Part2Screen } from '@/features/survey/types/part2-screen';
import type { WineTypeId } from '@/features/survey/constants/wine-survey';
import { z } from 'zod';

const STORAGE_KEY = 'corkpop:pending-survey-result';

const pendingSurveySnapshotSchema = z.object({
  q1Id: z.string().nullable(),
  q2Id: z.string().nullable(),
  q3Ids: z.array(z.string()),
  experience: z.record(z.string(), z.record(z.string(), z.number())),
  expectationGeneral: z.record(z.string(), z.number()),
  foods: z.array(z.string()),
  part2Screens: z.array(
    z.union([
      z.object({ kind: z.literal('glossary') }),
      z.object({ kind: z.literal('experienceWineIntro'), wine: z.string() }),
      z.object({ kind: z.literal('experience'), wine: z.string(), field: z.string() }),
      z.object({ kind: z.literal('expectationIntro') }),
      z.object({ kind: z.literal('expectation'), field: z.string() }),
      z.object({ kind: z.literal('food') }),
    ]),
  ),
});

export type PendingSurveySnapshot = {
  q1Id: string | null;
  q2Id: string | null;
  q3Ids: WineTypeId[];
  experience: FullSurveyAnswers['experience'];
  expectationGeneral: FullSurveyAnswers['expectationGeneral'];
  foods: string[];
  part2Screens: Part2Screen[];
};

const readStorage = (): PendingSurveySnapshot | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = pendingSurveySnapshotSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return null;
    }

    return parsed.data as PendingSurveySnapshot;
  } catch {
    return null;
  }
};

export const savePendingSurveySnapshot = (snapshot: PendingSurveySnapshot) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};

export const loadPendingSurveySnapshot = () => readStorage();

export const clearPendingSurveySnapshot = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
};

export const hasPendingSurveySaveIntent = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get('pendingSave') === '1';
};

export const clearPendingSurveySaveIntentFromUrl = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.history.replaceState({}, '', '/survey');
};
