import {
  EXPECTATION_FIELD_ORDER,
  EXPERIENCE_FIELD_ORDER,
  WINE_TYPE_IDS,
  type WineTypeId,
} from '@/features/survey/constants/wine-survey';
import type { Part2Screen } from '@/features/survey/types/part2-screen';

export const buildPart2Screens = (selectedTypes: WineTypeId[]): Part2Screen[] => {
  const selected = new Set(selectedTypes);
  const unselected = WINE_TYPE_IDS.filter((id) => !selected.has(id));

  const screens: Part2Screen[] = [];

  if (selectedTypes.length > 0) {
    screens.push({ kind: 'glossary' });
    selectedTypes.forEach((wine, index) => {
      if (index > 0) {
        screens.push({ kind: 'experienceWineIntro', wine });
      }
      EXPERIENCE_FIELD_ORDER.forEach((field) => {
        screens.push({ kind: 'experience', wine, field });
      });
    });

    if (unselected.length > 0) {
      screens.push({ kind: 'expectationIntro' });
    }
  }

  if (unselected.length > 0) {
    EXPECTATION_FIELD_ORDER.forEach((field) => {
      screens.push({ kind: 'expectation', field });
    });
  }

  screens.push({ kind: 'food' });

  return screens;
};
