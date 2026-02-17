import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleLoginSuccess, getCurrentUser } from '../api/auth.api';

interface UseLoginSuccessReturn {
  error: string | null;
  isLoading: boolean;
}

/**
 * 로그인 성공 처리 커스텀 훅
 * OAuth2 로그인 성공 후 토큰 처리 및 리다이렉트
 */
export const useLoginSuccess = (): UseLoginSuccessReturn => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processLogin = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // accessToken 또는 token 파라미터에서 토큰 추출 (호환성 유지)
        // HashRouter 사용 시 URL에서 직접 파싱도 시도
        const token = searchParams.get('accessToken') || searchParams.get('token') || 
          (() => {
            // HashRouter를 사용하는 경우 window.location.hash에서도 확인
            const hash = window.location.hash;
            const hashParams = new URLSearchParams(hash.split('?')[1] || '');
            return hashParams.get('accessToken') || hashParams.get('token');
          })();

        if (!token) {
          setError('토큰이 없습니다.');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        // 토큰 저장
        handleLoginSuccess(token);

        // 사용자 정보 확인
        const user = await getCurrentUser();
        if (user) {
          console.log('로그인 성공:', user.email);
          navigate('/home', { replace: true });
        } else {
          setError('사용자 정보를 가져올 수 없습니다.');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error('로그인 처리 실패:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    processLogin();
  }, [searchParams, navigate]);

  return { error, isLoading };
};







