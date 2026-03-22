import apiClient from '../../../api/client';
import type {
  GlobalResponse,
  SelfStudyListResponse,
  CreateSelfStudyResponse,
  SelfStudyFileResponse,
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
 * SelfStudy 생성
 */
export const createSelfStudy = async (
  title: string,
  description?: string,
  file?: File
): Promise<CreateSelfStudyResponse> => {
  const formData = new FormData();
  // Spring @RequestPart("request") — 그룹 문서 업로드(addGroupDocument)와 동일한 멀티파트 형식
  const requestPayload = JSON.stringify({
    title,
    description: description ?? '',
  });
  formData.append(
    'request',
    new Blob([requestPayload], { type: 'application/json' })
  );
  if (file) {
    formData.append('file', file);
  }

  const response = await apiClient.post<GlobalResponse<CreateSelfStudyResponse>>(
    '/api/selfStudy',
    formData
  );
  return response.data.result;
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
