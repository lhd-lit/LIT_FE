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

        console.log('[useLoginSuccess] URL 파라미터 확인:', {
          searchParams_accessToken: searchParams.get('accessToken'),
          searchParams_token: searchParams.get('token'),
          hash: window.location.hash,
          token: token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : null,
          tokenLength: token?.length,
        });

        if (!token) {
          console.error('[useLoginSuccess] 토큰이 없습니다');
          setError('토큰이 없습니다.');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        console.log('[useLoginSuccess] 토큰 추출 완료:', {
          tokenLength: token.length,
          tokenPreview: `${token.substring(0, 30)}...${token.substring(token.length - 30)}`,
          tokenFull: token, // 디버깅용 전체 토큰 값
        });
        
        // 토큰 저장
        console.log('[useLoginSuccess] 토큰 저장 시작');
        handleLoginSuccess(token);
        console.log('[useLoginSuccess] 토큰 저장 완료');

        // 사용자 정보 확인
        console.log('[useLoginSuccess] 사용자 정보 조회 시작');
        const user = await getCurrentUser();
        console.log('[useLoginSuccess] 사용자 정보 조회 결과:', user);
        
        if (user) {
          console.log('[useLoginSuccess] 로그인 성공:', user.email);
          navigate('/home', { replace: true });
        } else {
          console.error('[useLoginSuccess] 사용자 정보를 가져올 수 없습니다');
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







