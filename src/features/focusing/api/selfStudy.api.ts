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
  formData.append('title', title);
  if (description) {
    formData.append('description', description);
  }
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
