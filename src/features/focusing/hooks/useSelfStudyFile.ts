import { useState, useEffect } from 'react';
import { getSelfStudyFile } from '../api/selfStudy.api';

interface UseSelfStudyFileReturn {
  fileUrl: string | null;
  loading: boolean;
  error: string | null;
}

export const useSelfStudyFile = (selfStudyId: string | undefined): UseSelfStudyFileReturn => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selfStudyId) {
      setError('Document ID가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchFileUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await getSelfStudyFile(selfStudyId);
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
  }, [selfStudyId]);

  return { fileUrl, loading, error };
};

