const WITHDRAW_SYSTEM_ERROR =
  '시스템 오류로 탈퇴기능이 수행되지 않았습니다. 관리자에게 문의하세요';

export const withdrawAccount = async () => {
  const response = await fetch('/api/account/delete', {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(WITHDRAW_SYSTEM_ERROR);
  }

  return (await response.json()) as { success: boolean };
};

export const WITHDRAW_ERROR_MESSAGE = WITHDRAW_SYSTEM_ERROR;
