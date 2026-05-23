import type {
  ExpectationField,
  ExperienceField,
  WineTypeId,
} from '@/features/survey/constants/wine-survey';

export type Part2Screen =
  | { kind: 'glossary' }
  | { kind: 'experienceWineIntro'; wine: WineTypeId }
  | { kind: 'experience'; wine: WineTypeId; field: ExperienceField }
  | { kind: 'expectationIntro' }
  | { kind: 'expectation'; field: ExpectationField }
  | { kind: 'food' };
