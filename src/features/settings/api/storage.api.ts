import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { StorageStats } from '../types';
import { mapApiResultToStorageStats, type StorageUsageResponse } from '../utils/storage.utils';

export type { StorageUsageResponse };

/**
 * GET /api/users/storage — 사용자 파일 저장 용량
 */
export async function getStorageUsage(): Promise<StorageStats> {
  const response = await apiClient.get<GlobalResponse<unknown>>('/api/users/storage');
  return mapApiResultToStorageStats(response.data.result);
}
