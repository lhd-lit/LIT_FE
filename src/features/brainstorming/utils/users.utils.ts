import type { Member } from '../types';
import type { UserSearchResponse } from '../api/users.dto';

/**
 * 이름에서 이니셜 추출
 */
const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * UserSearchResponse를 Member 타입으로 변환
 */
export const convertUserToMember = (user: UserSearchResponse | null | undefined): Member | null => {
  if (!user || user.userId == null) {
    return null;
  }

  return {
    id: user.userId.toString(),
    name: user.name || '',
    initials: getInitials(user.name || ''),
  };
};

/**
 * UserSearchResponse 목록을 Member 목록으로 변환
 */
export const convertUsersToMembers = (users: UserSearchResponse[]): Member[] => {
  if (!Array.isArray(users)) {
    return [];
  }

  return users
    .map(convertUserToMember)
    .filter((member): member is Member => member !== null);
};



