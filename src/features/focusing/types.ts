/**
 * SelfStudy 관련 타입 정의
 */

/**
 * 백엔드 GlobalResponse 래퍼 타입
 */
export interface GlobalResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/**
 * SelfStudy 응답 타입
 */
export interface SelfStudyResponse {
  selfStudyId: number;
  title: string;
  writerName: string;
  description?: string;
  originalFileName?: string;
  lastViewedAt?: string | null;
}

/**
 * SelfStudy 목록 응답 타입 (페이지네이션)
 */
export interface SelfStudyListResponse {
  content: SelfStudyResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * SelfStudy 생성 응답 타입
 */
export interface CreateSelfStudyResponse {
  id: number; // 백엔드 CreateSelfStudyResponse는 id를 사용
  title: string;
  description: string;
}

/**
 * SelfStudy 파일 응답 타입
 */
export interface SelfStudyFileResponse {
  title: string;
  description: string;
  presignedUrl: string;
}

export type SortOption = {
  value: 'recent' | 'title';
  label: string;
};

/** POST /api/selfStudy/confirm 요청 본문 */
export interface SelfStudyConfirmRequest {
  title: string;
  description?: string;
  s3Key: string;
  originalFileName: string;
  fileSize: number;
}
