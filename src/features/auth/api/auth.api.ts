import apiClient from '../../../api/client';
import { getToken, setToken, removeToken } from '../../../lib/token';

/**
 * JWT 토큰 페이로드
 */
interface JWTPayload {
  sub: string; // userId (String으로 저장됨)
  email: string; // 이메일
  role: string;
  iat?: number;
  exp?: number;
}

export const initiateGoogleLogin = async (): Promise<void> => {
  const baseURL = apiClient.defaults.baseURL;
  if (!baseURL) {
    alert('API 서버 주소가 설정되지 않았습니다.');
    return;
  }
  
  const loginUrl = `${baseURL}/oauth2/authorization/google`;
  // Electron 감지: electronAPI 존재 여부로 확인 (더 정확함)
  const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;
  
  if (isElectron) {
    // Electron: electronAPI를 통해 시스템 브라우저로 열기
    if (window.electronAPI && window.electronAPI.openExternal) {
      try {
        await window.electronAPI.openExternal(loginUrl);
      } catch (error) {
        console.error('외부 브라우저 열기 실패:', error);
        alert('브라우저를 열 수 없습니다.');
      }
    } else {
      console.error('electronAPI가 사용 불가능합니다.');
      // Fallback: window.open 시도 (차단될 수 있음)
      window.open(loginUrl, '_blank');
    }
  } else {
    // 웹: 현재 창에서 리다이렉트
    window.location.href = loginUrl;
  }
};

/**
 * 로그인 성공 후 토큰 저장
 */
export const handleLoginSuccess = (token: string): void => {
  setToken(token);
};

/**
 * 로그아웃
 */
export const logout = (): void => {
  removeToken();
  window.location.href = '/';
};

/**
 * JWT 토큰 파싱
 */
const parseJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('JWT 파싱 실패:', error);
    return null;
  }
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export const getCurrentUser = async (): Promise<{ userId: number; email: string; role: string } | null> => {
  const token = getToken();
  if (!token) {
    return null;
  }

  const payload = parseJWT(token);
  if (!payload || !payload.sub) {
    return null;
  }

  return {
    userId: parseInt(payload.sub, 10),
    email: payload.email || '',
    role: payload.role || 'USER',
  };
};

/**
 * JWT 토큰 유효성 확인
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return false;
  }

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime < expirationTime;
};
