import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { SelfStudyResponse } from '../../focusing/types';
import type { StudyGroupResponse } from '../../brainstorming/api/groups.api';

/**
 * 북마크 응답 타입 (SelfStudy 또는 Group)
 */
export interface BookmarkResponse {
  selfStudyId?: number;
  studyGroupId?: number;
  title: string;
  writerName?: string;
  ownerName?: string;
  description?: string;
  originalFileName?: string;
  memberCount?: number;
  type: 'SELF_STUDY' | 'GROUP';
}

/**
 * 북마크 목록 응답 타입
 */
export interface BookmarkListResponse {
  content: BookmarkResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 최근 SelfStudy 응답 타입
 */
export interface RecentSelfStudyResponse extends SelfStudyResponse {}

/**
 * 최근 Group 응답 타입
 */
export interface RecentGroupResponse extends StudyGroupResponse {}

/**
 * 북마크 목록 조회
 */
export const getBookmarks = async (): Promise<BookmarkListResponse> => {
  const response = await apiClient.get<GlobalResponse<BookmarkListResponse>>('/api/bookmark');
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



