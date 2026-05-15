import { useState, useEffect } from "react";
import { getCurrentUser } from "../../features/auth/api/auth.api";

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

export function HeaderAvatar() {
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('profileImage')
  );
  const [initials, setInitials] = useState<string>('?');

  useEffect(() => {
    // 초기 프로필 이미지 로드
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // 사용자 이니셜 가져오기
    getCurrentUser().then((user) => {
      if (user?.email) {
        const name = user.email.split('@')[0] || 'User';
        setInitials(getInitials(name));
      }
    });

    // 프로필 이미지 변경 이벤트 리스너
    const handleImageChange = (event: CustomEvent) => {
      setProfileImage(event.detail);
    };

    window.addEventListener('profileImageChanged', handleImageChange as EventListener);

    return () => {
      window.removeEventListener('profileImageChanged', handleImageChange as EventListener);
    };
  }, []);

  return (
    <button
      className="
        relative
        rounded-full
        overflow-hidden
        w-9 h-9
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-gray-300
      "
      aria-label="User profile"
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="
          w-full
          h-full
          bg-gradient-to-b
          from-background-card
          to-primary
          text-white
          flex
          items-center
          justify-center
          text-xs
          font-inter
        ">
          {initials}
        </div>
      )}
    </button>
  );
}