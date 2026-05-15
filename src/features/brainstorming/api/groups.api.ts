import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { PresignedUploadResponse } from '../../../shared/types/presignedUpload';
import { normalizeUploadOriginalFileName, uploadFileToS3PresignedPut } from '../../../shared/utils/file.utils';
import type {
  AddGroupDocumentResponse,
  CreateGroupResponse,
  GroupDocumentConfirmRequest,
  GroupDocumentListResponse,
  GroupFileResponse,
  StudyGroupListResponse,
} from './groups.dto';

export type {
  AddGroupDocumentRequest,
  AddGroupDocumentResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  GroupDocumentConfirmRequest,
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
 * 그룹 문서 업로드용 Presigned URL 발급
 */
export const getGroupDocumentPresignedUploadUrl = async (
  groupId: number | string,
  originalFileName: string
): Promise<PresignedUploadResponse> => {
  const response = await apiClient.post<GlobalResponse<PresignedUploadResponse>>(
    `/api/groups/${groupId}/documents/presigned-url`,
    undefined,
    { params: { originalFileName } }
  );
  return response.data.result;
};

/**
 * S3 업로드 완료 후 그룹 문서 DB 저장
 */
export const confirmGroupDocument = async (
  groupId: number | string,
  body: GroupDocumentConfirmRequest
): Promise<AddGroupDocumentResponse> => {
  const response = await apiClient.post<GlobalResponse<AddGroupDocumentResponse>>(
    `/api/groups/${groupId}/documents/confirm`,
    body
  );
  return response.data.result;
};

/**
 * 그룹에 문서 추가: Presigned URL 발급 → S3 PUT → confirm
 */
export const addGroupDocument = async (
  groupId: number | string,
  title: string,
  description: string | undefined,
  file: File
): Promise<AddGroupDocumentResponse> => {
  const originalFileName = normalizeUploadOriginalFileName(file);
  const presigned = await getGroupDocumentPresignedUploadUrl(groupId, originalFileName);
  await uploadFileToS3PresignedPut(presigned.presignedUrl, file);
  return confirmGroupDocument(groupId, {
    title,
    description: description ?? '',
    s3Key: presigned.s3Key,
    originalFileName: presigned.originalFileName,
    fileSize: file.size,
  });
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
