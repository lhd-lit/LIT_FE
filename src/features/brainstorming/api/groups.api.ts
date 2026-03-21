import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';

/**
 * 스터디 그룹 응답 타입
 */
export interface StudyGroupResponse {
  studyGroupId: number;
  name: string;
  description: string;
  ownerName: string;
  memberCount: number;
  lastViewedAt: string;
}

/**
 * 스터디 그룹 목록 응답 타입 (페이지네이션)
 */
export interface StudyGroupListResponse {
  content: StudyGroupResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 그룹 문서 응답 타입
 */
export interface GroupDocumentResponse {
  groupDocumentId: number;
  selfStudyId: number;
  title: string;
  description: string;
  uploaderName: string;
}

/**
 * 그룹 문서 목록 응답 타입 (페이지네이션)
 */
export interface GroupDocumentListResponse {
  content: GroupDocumentResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 내 스터디 그룹 목록 조회
 */
export const getMyGroups = async (
  page: number = 0,
  size: number = 10
): Promise<StudyGroupListResponse> => {
  const response = await apiClient.get<GlobalResponse<StudyGroupListResponse>>('/api/groups/me', {
    params: { page, size },
  });
  return response.data.result;
};

/**
 * 스터디 그룹 단건 조회
 * 주의: 백엔드에서 GET /api/groups/{groupId}가 주석 처리되어 있어서 사용하지 않음
 * 대신 getMyGroups로 목록을 가져와서 찾아야 함
 */
// export const getGroup = async (groupId: number | string): Promise<StudyGroupResponse> => {
//   const response = await apiClient.get<GlobalResponse<StudyGroupResponse>>(
//     `/api/groups/${groupId}`
//   );
//   return response.data.result;
// };

/**
 * 그룹 문서 목록 조회
 */
export const getGroupDocuments = async (
  groupId: number | string,
  page: number = 0,
  size: number = 10
): Promise<GroupDocumentListResponse> => {
  const response = await apiClient.get<GlobalResponse<GroupDocumentListResponse>>(
    `/api/groups/${groupId}/documents`,
    {
      params: { page, size },
    }
  );
  return response.data.result;
};

/**
 * 그룹 생성 요청 타입
 */
export interface CreateGroupRequest {
  name: string;
  description?: string;
}

/**
 * 그룹 생성 응답 타입
 */
export interface CreateGroupResponse {
  id: number;
  name: string;
  description: string;
  ownerName: string;
}

/**
 * 스터디 그룹 생성
 */
export const createGroup = async (
  name: string,
  description?: string
): Promise<CreateGroupResponse> => {
  const response = await apiClient.post<GlobalResponse<CreateGroupResponse>>('/api/groups', {
    name,
    description,
  });
  return response.data.result;
};

/**
 * 그룹 문서 추가 요청 타입
 */
export interface AddGroupDocumentRequest {
  title: string;
  description?: string;
}

/**
 * 그룹 문서 추가 응답 타입
 */
export interface AddGroupDocumentResponse {
  groupDocumentId: number;
  title: string;
  uploaderName: string;
}

/**
 * 그룹에 문서 추가
 */
export const addGroupDocument = async (
  groupId: number | string,
  title: string,
  description: string | undefined,
  file: File
): Promise<AddGroupDocumentResponse> => {
  const formData = new FormData();
  formData.append('request', JSON.stringify({ title, description: description || '' }));
  formData.append('file', file);

  const response = await apiClient.post<GlobalResponse<AddGroupDocumentResponse>>(
    `/api/groups/${groupId}/documents`,
    formData
  );
  return response.data.result;
};

/**
 * 그룹 문서 파일 응답 타입
 */
export interface GroupFileResponse {
  title: string;
  description: string;
  presignedUrl: string;
}

/**
 * 그룹 문서 파일 Presigned URL 가져오기
 */
export const getGroupDocumentFile = async (
  groupId: number | string,
  groupDocumentId: number | string
): Promise<string> => {
  const response = await apiClient.get<GlobalResponse<GroupFileResponse>>(
    `/api/groups/${groupId}/documents/${groupDocumentId}/file`
  );
  return response.data.result.presignedUrl;
};
