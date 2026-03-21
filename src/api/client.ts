import axios from 'axios';
import { getToken } from '../lib/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://lit.io.kr:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * JWT 토큰에서 사용자 ID 추출
 */
const getUserIdFromToken = (token: string): string | null => {
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
    const payload = JSON.parse(jsonPayload);
    // JWT의 sub 필드가 사용자 ID
    return payload.sub ? String(payload.sub) : null;
  } catch (error) {
    console.error('JWT 파싱 실패:', error);
    return null;
  }
};

// Request interceptor: 인증 토큰, X-USER-ID 헤더 및 FormData 처리
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰 추가
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // JWT에서 사용자 ID 추출하여 X-USER-ID 헤더 추가
      const userId = getUserIdFromToken(token);
      if (userId) {
        config.headers['X-USER-ID'] = userId;
      }
    }
    
    // FormData를 사용하는 경우 Content-Type 헤더 제거
    if (config.data instanceof FormData) {
      // 기본 헤더에서 Content-Type 제거
      if (config.headers) {
        // Content-Type 헤더를 명시적으로 제거하여 axios가 자동으로 multipart/form-data를 설정하도록 함
        delete config.headers['Content-Type'];
        // AxiosHeaders 타입에 대응
        const headers = config.headers as any;
        if (headers.common) {
          delete headers.common['Content-Type'];
        }
        if (headers.post) {
          delete headers.post['Content-Type'];
        }
        if (headers.put) {
          delete headers.put['Content-Type'];
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: 401 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러인 경우 (인증 실패)
    if (error.response?.status === 401) {
      // HTML 응답인 경우 (로그인 페이지로 리다이렉트된 경우)
      const contentType = error.response?.headers?.['content-type'] || '';
      if (contentType.includes('text/html')) {
        console.error('인증이 필요합니다. 로그인 페이지로 리다이렉트되었습니다.');
        // Electron에서는 로그인 페이지로 이동
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

