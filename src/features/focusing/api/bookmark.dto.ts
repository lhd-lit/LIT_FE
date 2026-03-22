/** GET /api/bookmark 페이지 응답 (백엔드 GetBookmarkListResponse) */

export interface BookmarkListItem {
  id: number;
  selfStudyId: number;
  selfStudyTitle: string;
  createdAt: string;
}

export interface BookmarkPageResult {
  content: BookmarkListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
