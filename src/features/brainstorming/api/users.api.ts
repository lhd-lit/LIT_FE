import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';

/**
 * 사용자 검색 응답 타입
 */
export interface UserSearchResponse {
  userId: number;
  name: string;
  email: string;
  alreadySelected: boolean;
}

/**
 * 사용자 검색
 * @param email 검색할 이메일
 * @param excludeUserIds 제외할 사용자 ID 목록
 */
export const searchUsers = async (
  email: string,
  excludeUserIds?: number[]
): Promise<UserSearchResponse | null> => {
  if (!email.trim()) {
    return null;
  }

  const params: Record<string, any> = { email };
  if (excludeUserIds && excludeUserIds.length > 0) {
    params.excludeUserIds = excludeUserIds;
  }

  const response = await apiClient.get<GlobalResponse<UserSearchResponse>>('/api/users/search', {
    params,
  });
  return response.data.result;
};



