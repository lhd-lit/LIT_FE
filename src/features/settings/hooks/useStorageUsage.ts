import { useState, useEffect } from 'react';
import { getToken } from '../../../lib/token';
import { getStorageUsage } from '../api/storage.api';
import type { StorageStats } from '../types';

export function useStorageUsage() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getStorageUsage();
        setStats(data);
      } catch (e: unknown) {
        const message =
          e && typeof e === 'object' && 'response' in e
            ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;
        setError(message || '저장 용량 정보를 불러오지 못했습니다.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return { stats, loading, error };
}
