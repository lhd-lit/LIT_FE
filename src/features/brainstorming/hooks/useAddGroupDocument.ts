import { useState } from 'react';
import { addGroupDocument } from '../api/groups.api';

interface AddDocumentPayload {
  title: string;
  description?: string;
  file: File | null;
}

export const useAddGroupDocument = (
  groupId: string | undefined,
  onSuccess?: () => void
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDocument = async (payload: AddDocumentPayload) => {
    if (!groupId) {
      setError('그룹 ID가 없습니다.');
      return;
    }

    if (!payload.file) {
      setError('파일을 선택해주세요.');
      return;
    }

    if (!payload.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await addGroupDocument(
        groupId,
        payload.title.trim(),
        payload.description?.trim(),
        payload.file
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorData = err?.response?.data;
      const message =
        errorData?.message || err?.message || '문서 추가에 실패했습니다. 다시 시도해주세요.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddDocument, loading, error };
};

