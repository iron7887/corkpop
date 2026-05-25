export const SURVEY_PENDING_SAVE_SEARCH = 'pendingSave=1';

export const SURVEY_PENDING_SAVE_PATH = `/survey?${SURVEY_PENDING_SAVE_SEARCH}`;

export const buildSurveyLoginHref = () =>
  `/login?callbackUrl=${encodeURIComponent(SURVEY_PENDING_SAVE_PATH)}`;

export const buildSurveySignupHref = () =>
  `/signup?callbackUrl=${encodeURIComponent(SURVEY_PENDING_SAVE_PATH)}`;
