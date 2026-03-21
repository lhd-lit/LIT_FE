import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { StorageStats } from '../types';

/** 백엔드 StorageResponse와 동일 */
export interface StorageUsageResponse {
  usedBytes: number;
  totalBytes: number;
  availableBytes: number;
  usedPercent: number;
}

const BYTES_PER_GB = 1024 ** 3;

function bytesToGbRounded(bytes: number): number {
  return Math.round((bytes / BYTES_PER_GB) * 100) / 100;
}

export function mapStorageResponseToStats(data: StorageUsageResponse): StorageStats {
  const used = bytesToGbRounded(data.usedBytes);
  const total = bytesToGbRounded(data.totalBytes);
  return {
    used,
    total,
    unit: 'GB',
    description: `You are using ${data.usedPercent}% of your ${total} GB quota. ${bytesToGbRounded(data.availableBytes)} GB remaining.`,
  };
}

/**
 * GET /api/users/storage — 사용자 파일 저장 용량
 */
export async function getStorageUsage(): Promise<StorageStats> {
  const response = await apiClient.get<GlobalResponse<StorageUsageResponse>>('/api/users/storage');
  return mapStorageResponseToStats(response.data.result);
}
