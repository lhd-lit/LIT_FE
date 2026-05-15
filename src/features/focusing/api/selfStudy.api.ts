import apiClient from '../../../api/client';
import type { PresignedUploadResponse } from '../../../shared/types/presignedUpload';
import { normalizeUploadOriginalFileName, uploadFileToS3PresignedPut } from '../../../shared/utils/file.utils';
import type {
  GlobalResponse,
  SelfStudyListResponse,
  CreateSelfStudyResponse,
  SelfStudyFileResponse,
  SelfStudyConfirmRequest,
} from '../types';

/**
 * 내 SelfStudy 목록 조회
 */
export const getMySelfStudyList = async (
  page: number = 0,
  size: number = 10
): Promise<SelfStudyListResponse> => {
  const response = await apiClient.get<GlobalResponse<SelfStudyListResponse>>('/api/selfStudy/me', {
    params: { page, size },
  });
  return response.data.result;
};

/**
 * 업로드용 Presigned URL 발급 (파일명은 confirm 시와 동일한 문자열 사용)
 */
export const getSelfStudyPresignedUploadUrl = async (
  originalFileName: string
): Promise<PresignedUploadResponse> => {
  const response = await apiClient.post<GlobalResponse<PresignedUploadResponse>>(
    '/api/selfStudy/presigned-url',
    undefined,
    { params: { originalFileName } }
  );
  return response.data.result;
};

/**
 * S3 업로드 완료 후 SelfStudy DB 저장
 */
export const confirmSelfStudy = async (
  body: SelfStudyConfirmRequest
): Promise<CreateSelfStudyResponse> => {
  const response = await apiClient.post<GlobalResponse<CreateSelfStudyResponse>>(
    '/api/selfStudy/confirm',
    body
  );
  return response.data.result;
};

/**
 * SelfStudy 생성: Presigned URL 발급 → S3 PUT → confirm
 */
export const createSelfStudy = async (
  title: string,
  description: string | undefined,
  file: File
): Promise<CreateSelfStudyResponse> => {
  const originalFileName = normalizeUploadOriginalFileName(file);
  const presigned = await getSelfStudyPresignedUploadUrl(originalFileName);
  await uploadFileToS3PresignedPut(presigned.presignedUrl, file);
  return confirmSelfStudy({
    title,
    description: description ?? '',
    s3Key: presigned.s3Key,
    originalFileName: presigned.originalFileName,
    fileSize: file.size,
  });
};

/**
 * SelfStudy 파일 Presigned URL 가져오기
 */
export const getSelfStudyFile = async (selfStudyId: number | string): Promise<string> => {
  const response = await apiClient.get<GlobalResponse<SelfStudyFileResponse>>(
    `/api/selfStudy/${selfStudyId}/file`
  );
  return response.data.result.presignedUrl;
};

/**
 * SelfStudy 삭제
 */
export const deleteSelfStudy = async (selfStudyId: number | string): Promise<void> => {
  await apiClient.delete(`/api/selfStudy/${selfStudyId}`);
};
