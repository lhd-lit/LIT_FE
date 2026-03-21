import apiClient from '../../../api/client';
import { getToken, setToken, removeToken } from '../../../lib/token';

/**
 * JWT 토큰 페이로드
 */
interface JWTPayload {
  sub: string; // 이메일
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
      alert('Electron API를 사용할 수 없습니다.');
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
  console.log('[handleLoginSuccess] 토큰 저장 시작:', {
    tokenLength: token.length,
    tokenPreview: `${token.substring(0, 30)}...${token.substring(token.length - 30)}`,
    tokenFull: token, // 디버깅용 전체 토큰 값
  });
  setToken(token);
  console.log('[handleLoginSuccess] 토큰 저장 완료');
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
export const getCurrentUser = async (): Promise<{ email: string; role: string; userId?: number } | null> => {
  console.log('[getCurrentUser] 함수 호출');
  const token = getToken();
  console.log('[getCurrentUser] 토큰 확인:', {
    exists: !!token,
    length: token?.length,
    preview: token ? `${token.substring(0, 30)}...${token.substring(token.length - 30)}` : null,
  });
  
  if (!token) {
    console.warn('[getCurrentUser] 토큰이 없습니다');
    return null;
  }

  const payload = parseJWT(token);
  console.log('[getCurrentUser] JWT 페이로드:', {
    payload,
    sub: payload?.sub,
    email: payload?.email,
    role: payload?.role,
  });
  
  if (!payload || !payload.sub) {
    console.error('[getCurrentUser] 페이로드가 없거나 sub가 없습니다:', payload);
    return null;
  }

  const result = {
    email: payload.email || payload.sub, // email 필드가 있으면 사용, 없으면 sub 사용
    role: payload.role || 'USER',
    userId: payload.sub ? parseInt(payload.sub, 10) : undefined,
  };
  
  console.log('[getCurrentUser] 반환값:', result);
  return result;
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
