import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { UserSearchResponse } from './users.dto';

export type { UserSearchResponse } from './users.dto';

/**
 * 사용자 검색 (백엔드: 이메일 @ 앞 로컬 파트 부분 일치, 응답은 목록)
 */
export const searchUsers = async (email: string): Promise<UserSearchResponse[]> => {
  if (!email.trim()) {
    return [];
  }

  const response = await apiClient.get<GlobalResponse<UserSearchResponse[]>>('/api/users/search', {
    params: { email: email.trim() },
  });
  const result = response.data.result;
  return Array.isArray(result) ? result : result ? [result] : [];
};
