import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { GroupBookmarkPageResult } from './groupBookmark.dto';

export type { GroupBookmarkListItem, GroupBookmarkPageResult } from './groupBookmark.dto';

export async function getGroupBookmarkList(page = 0, size = 100): Promise<GroupBookmarkPageResult> {
  const response = await apiClient.get<GlobalResponse<GroupBookmarkPageResult>>('/api/bookmark/group', {
    params: { page, size },
  });
  return response.data.result;
}

export async function createStudyGroupBookmark(studyGroupId: number): Promise<void> {
  await apiClient.post(`/api/bookmark/group/${studyGroupId}`);
}

export async function deleteStudyGroupBookmark(studyGroupId: number): Promise<void> {
  await apiClient.delete(`/api/bookmark/group/${studyGroupId}`);
}

