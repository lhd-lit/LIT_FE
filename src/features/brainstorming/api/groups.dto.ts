/**
 * GET/POST 그룹·문서 API 계약 (api ↔ utils 공유). HTTP 호출은 groups.api.ts만 담당.
 */

export interface StudyGroupResponse {
  studyGroupId: number;
  name: string;
  description: string;
  ownerName: string;
  memberCount: number;
  lastViewedAt: string;
}

export interface StudyGroupListResponse {
  content: StudyGroupResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface GroupDocumentResponse {
  groupDocumentId: number;
  selfStudyId: number;
  title: string;
  description: string;
  uploaderName: string;
}

export interface GroupDocumentListResponse {
  content: GroupDocumentResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface CreateGroupResponse {
  id: number;
  name: string;
  description: string;
  ownerName: string;
}

export interface AddGroupDocumentRequest {
  title: string;
  description?: string;
}

export interface AddGroupDocumentResponse {
  groupDocumentId: number;
  title: string;
  uploaderName: string;
}

export interface GroupFileResponse {
  title: string;
  description: string;
  presignedUrl: string;
}
