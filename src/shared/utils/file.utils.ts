/**
 * 파일 다운로드 유틸리티
 */
export const downloadFile = (url: string, filename: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noreferrer';
  a.click();
};

/**
 * Presigned URL 발급·confirm에 사용할 표시용 파일명.
 * 브라우저 File.name은 경로 없음; 공백 정리·빈 이름 방지만 수행.
 * S3 객체 키의 고유성은 서버(UUID)가 보장.
 */
export function normalizeUploadOriginalFileName(file: File): string {
  const raw = file.name?.trim() ?? '';
  if (!raw) return 'untitled';
  return raw.replace(/\s+/g, ' ');
}

/**
 * S3 PUT Presigned URL로 파일 본문 업로드 (서버가 서명한 URL과 동일한 방식으로만 요청).
 */
export async function uploadFileToS3PresignedPut(
  presignedUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      text ? `S3 업로드 실패 (${res.status}): ${text}` : `S3 업로드 실패 (${res.status})`
    );
  }
}

