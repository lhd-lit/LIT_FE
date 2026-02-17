import { useState, useEffect } from "react";
import { getToken } from "../../../lib/token";
import { getCurrentUser } from "../../auth/api/auth.api";

interface UserProfile {
  name: string;
  email: string;
  initials: string;
}

/**
 * 이름에서 이니셜 추출
 */
const getInitials = (name: string): string => {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('[useUserProfile] 사용자 프로필 조회 시작');
        setLoading(true);
        setError(null);

        // 토큰 확인
        const token = getToken();
        console.log('[useUserProfile] 토큰 존재:', !!token);
        if (!token) {
          console.warn('[useUserProfile] 토큰이 없습니다');
          setError('로그인이 필요합니다. 토큰이 없습니다.');
          setLoading(false);
          return;
        }

        // 현재 사용자 정보 가져오기
        console.log('[useUserProfile] getCurrentUser 호출');
        const currentUser = await getCurrentUser();
        console.log('[useUserProfile] getCurrentUser 결과:', currentUser);

        if (!currentUser || !currentUser.email) {
          console.error('[useUserProfile] 사용자 정보를 가져올 수 없습니다:', currentUser);
          setError('사용자 정보를 가져올 수 없습니다.');
          setLoading(false);
          return;
        }

        // Mock 데이터로 임시 설정 (실제 API 연동 필요)
        const userProfile: UserProfile = {
          name: currentUser.email.split('@')[0] || 'User',
          email: currentUser.email,
          initials: getInitials(currentUser.email.split('@')[0] || 'User'),
        };

        console.log('[useUserProfile] 사용자 프로필 설정:', userProfile);
        setUser(userProfile);
      } catch (err: any) {
        console.error('[useUserProfile] 프로필 조회 실패:', err);
        console.error('[useUserProfile] 에러 상세:', {
          message: err.message,
          stack: err.stack,
          response: err.response,
        });
        setError(err.message || '프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
        console.log('[useUserProfile] 로딩 완료');
      }
    };

    fetchUserProfile();
  }, []);

  console.log('[useUserProfile] 반환값:', { user, loading, error });
  return { user, loading, error };
}

