import { useState, useEffect } from "react";
import { getToken } from "../../../lib/token";
import { getCurrentUser } from "../../auth/api/auth.api";

interface UserProfile {
  name: string;
  email: string;
  initials: string;
  profileImageUrl?: string | null;
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
        setLoading(true);
        setError(null);

        // 토큰 확인
        const token = getToken();
        if (!token) {
          setError('로그인이 필요합니다. 토큰이 없습니다.');
          setLoading(false);
          return;
        }

        // 현재 사용자 정보 가져오기
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.email) {
          setError('사용자 정보를 가져올 수 없습니다.');
          setLoading(false);
          return;
        }

        // localStorage에서 프로필 이미지 가져오기
        const profileImageUrl = localStorage.getItem('profileImage');

        // Mock 데이터로 임시 설정 (실제 API 연동 필요)
        const userProfile: UserProfile = {
          name: currentUser.email.split('@')[0] || 'User',
          email: currentUser.email,
          initials: getInitials(currentUser.email.split('@')[0] || 'User'),
          profileImageUrl: profileImageUrl,
        };

        setUser(userProfile);
      } catch (err: any) {
        setError(err.message || '프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, loading, error };
}

