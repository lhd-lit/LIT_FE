import { useState, useEffect } from 'react';
import { getGroupDocumentFile } from '../api/groups.api';

interface UseGroupDocumentFileReturn {
  fileUrl: string | null;
  loading: boolean;
  error: string | null;
}

export const useGroupDocumentFile = (
  groupId: string | undefined,
  groupDocumentId: string | undefined
): UseGroupDocumentFileReturn => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId || !groupDocumentId) {
      setError('그룹 ID 또는 문서 ID가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchFileUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await getGroupDocumentFile(groupId, groupDocumentId);
        setFileUrl(url);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || err?.message || '파일을 불러오는데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFileUrl();
  }, [groupId, groupDocumentId]);

  return { fileUrl, loading, error };
};

