/**
 * 토큰 관리 유틸리티
 */

/**
 * 저장된 토큰 가져오기
 */
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * 토큰이 존재하는지 확인
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};

/**
 * 토큰 저장
 */
export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * 토큰 제거
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

