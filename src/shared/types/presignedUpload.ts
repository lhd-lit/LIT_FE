/**
 * 백엔드 PresignedUploadResponse와 동일 (S3 직접 업로드용)
 */
export interface PresignedUploadResponse {
  presignedUrl: string;
  s3Key: string;
  originalFileName: string;
}
