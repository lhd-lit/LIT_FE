/** GET /api/bookmark/group 페이지 응답 (백엔드 GetGroupBookmarkListResponse) */

export interface GroupBookmarkListItem {
  bookmarkId: number;
  studyGroupId: number;
  groupName: string;
  groupDescription: string;
}

export interface GroupBookmarkPageResult {
  content: GroupBookmarkListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

