import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type {
  AddGroupDocumentResponse,
  CreateGroupResponse,
  GroupDocumentListResponse,
  GroupFileResponse,
  StudyGroupListResponse,
} from './groups.dto';

export type {
  AddGroupDocumentRequest,
  AddGroupDocumentResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  GroupDocumentListResponse,
  GroupDocumentResponse,
  GroupFileResponse,
  StudyGroupListResponse,
  StudyGroupResponse,
} from './groups.dto';

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

/**
 * 그룹 학습 문서 삭제
 */
export const deleteGroupDocument = async (
  groupId: number | string,
  groupDocumentId: number | string
): Promise<void> => {
  await apiClient.delete(`/api/groups/${groupId}/documents/${groupDocumentId}`);
};

/**
 * 스터디 그룹 탈퇴 (본인만, 방장 불가) — DELETE /api/groups/{groupId}/members/me
 */
export const leaveGroup = async (groupId: number | string): Promise<void> => {
  await apiClient.delete(`/api/groups/${groupId}/members/me`);
};
