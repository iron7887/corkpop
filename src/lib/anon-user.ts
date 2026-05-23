'use client';

const ANON_USER_KEY = 'corkpop_anon_user_id';

export const getOrCreateAnonUserId = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const existingId = window.localStorage.getItem(ANON_USER_KEY);
  if (existingId) {
    return existingId;
  }

  const createdId = crypto.randomUUID();
  window.localStorage.setItem(ANON_USER_KEY, createdId);
  return createdId;
};

export const getAnonUserId = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ANON_USER_KEY);
};

export const clearAnonUserId = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ANON_USER_KEY);
};
