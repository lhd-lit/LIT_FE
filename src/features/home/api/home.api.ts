import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { SelfStudyResponse } from '../../focusing/types';
import type { StudyGroupResponse } from '../../brainstorming/api/groups.dto';
import type { BookmarkPageResult } from '../../focusing/api/bookmark.dto';

export type { BookmarkListItem, BookmarkPageResult } from '../../focusing/api/bookmark.dto';

/**
 * 최근 SelfStudy 응답 타입
 */
export interface RecentSelfStudyResponse extends SelfStudyResponse {}

/**
 * 최근 Group 응답 타입
 */
export interface RecentGroupResponse extends StudyGroupResponse {}

/**
 * SelfStudy 즐겨찾기 목록 조회 (GET /api/bookmark, 페이지네이션)
 */
export const getBookmarks = async (page = 0, size = 100): Promise<BookmarkPageResult> => {
  const response = await apiClient.get<GlobalResponse<BookmarkPageResult>>('/api/bookmark', {
    params: { page, size },
  });
  return response.data.result;
};

/**
 * 최근 SelfStudy 조회
 */
export const getRecentSelfStudy = async (): Promise<RecentSelfStudyResponse | null> => {
  const response = await apiClient.get<GlobalResponse<RecentSelfStudyResponse>>('/api/selfStudy/recent');
  return response.data.result || null;
};

/**
 * 최근 Group 조회
 */
export const getRecentGroup = async (): Promise<RecentGroupResponse | null> => {
  const response = await apiClient.get<GlobalResponse<RecentGroupResponse>>('/api/groups/recent');
  return response.data.result || null;
};



