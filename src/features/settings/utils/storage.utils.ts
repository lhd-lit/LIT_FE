import type { StorageStats } from '../types';

export type StorageUsageResponse = {
  usedBytes: number;
  totalBytes: number;
  availableBytes: number;
  usedPercent: number;
};

const BYTES_PER_MB = 1024 ** 2;
const BYTES_PER_GB = 1024 ** 3;

function num(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function normalizePayload(raw: unknown): StorageUsageResponse {
  if (!raw || typeof raw !== 'object') {
    return { usedBytes: 0, totalBytes: 0, availableBytes: 0, usedPercent: 0 };
  }
  const r = raw as Record<string, unknown>;
  let usedBytes = num(r.usedBytes ?? r.used_bytes ?? r.usedByte);
  const totalBytes = num(
    r.totalBytes ?? r.total_bytes ?? r.quotaBytes ?? r.quota_bytes
  );
  let availableBytes = num(
    r.availableBytes ?? r.available_bytes ?? r.remainingBytes ?? r.remaining_bytes
  );
  if (!availableBytes && totalBytes > 0) {
    availableBytes = Math.max(0, totalBytes - usedBytes);
  }

  // usedBytes가 0인데 남은 용량으로 역산하면 사용량이 있는 경우(백엔드 필드 불일치) 보정
  if (totalBytes > 0 && availableBytes >= 0) {
    const impliedUsed = Math.max(0, totalBytes - availableBytes);
    if (usedBytes === 0 && impliedUsed > 0) {
      usedBytes = impliedUsed;
    }
  }

  const usedPercent =
    totalBytes > 0
      ? Math.min(100, Math.round((usedBytes / totalBytes) * 10000) / 100)
      : 0;

  return { usedBytes, totalBytes, availableBytes, usedPercent };
}

function toDisplayAmounts(
  usedBytes: number,
  totalBytes: number
): Pick<StorageStats, 'used' | 'total' | 'unit'> {
  const maxBytes = Math.max(usedBytes, totalBytes, 1);
  if (maxBytes >= BYTES_PER_GB) {
    const roundGb = (b: number) => Math.round((b / BYTES_PER_GB) * 10000) / 10000;
    return { unit: 'GB', used: roundGb(usedBytes), total: roundGb(totalBytes) };
  }
  const roundMb = (b: number) => Math.round((b / BYTES_PER_MB) * 100) / 100;
  return { unit: 'MB', used: roundMb(usedBytes), total: roundMb(totalBytes) };
}

/** API `result` → Settings 카드용 통계 */
export function mapApiResultToStorageStats(raw: unknown): StorageStats {
  const { usedBytes, totalBytes, availableBytes, usedPercent } = normalizePayload(raw);
  const { used, total, unit } = toDisplayAmounts(usedBytes, totalBytes);
  const availDisplay =
    unit === 'GB'
      ? Math.round((availableBytes / BYTES_PER_GB) * 10000) / 10000
      : Math.round((availableBytes / BYTES_PER_MB) * 100) / 100;
  return {
    used,
    total,
    unit,
    description: `You are using ${usedPercent}% of your ${total} ${unit} quota. ${availDisplay} ${unit} remaining.`,
  };
}
