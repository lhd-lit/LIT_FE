import apiClient from '../../../api/client';
import type { GlobalResponse } from '../types';
import type { BookmarkPageResult } from './bookmark.dto';

export type { BookmarkListItem, BookmarkPageResult } from './bookmark.dto';

export async function getBookmarkList(page = 0, size = 100): Promise<BookmarkPageResult> {
  const response = await apiClient.get<GlobalResponse<BookmarkPageResult>>('/api/bookmark', {
    params: { page, size },
  });
  return response.data.result;
}

export async function createSelfStudyBookmark(selfStudyId: number): Promise<void> {
  await apiClient.post(`/api/bookmark/selfStudy/${selfStudyId}`);
}

export async function deleteSelfStudyBookmark(selfStudyId: number): Promise<void> {
  await apiClient.delete(`/api/bookmark/selfStudy/${selfStudyId}`);
}
