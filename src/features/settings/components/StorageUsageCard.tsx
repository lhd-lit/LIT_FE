import storageIcon from "../assets/storageIcon.svg";
import type { StorageStats } from "../types";

type StorageUsageCardProps = {
  stats: StorageStats;
};

function formatStorageAmount(value: number, unit: StorageStats['unit']): string {
  if (!Number.isFinite(value)) return `0 ${unit}`;
  if (unit === 'GB') {
    const opts: Intl.NumberFormatOptions =
      value > 0 && value < 1
        ? { minimumFractionDigits: 2, maximumFractionDigits: 4 }
        : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return `${value.toLocaleString('en-US', opts)} GB`;
  }
  return `${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MB`;
}

function formatPercentUsed(used: number, total: number): string {
  if (total <= 0 || !Number.isFinite(used)) return '0';
  const p = Math.min(100, Math.max(0, (used / total) * 100));
  if (p === 0) return '0';
  if (p < 0.01) return p.toFixed(3);
  if (p < 1) return p.toFixed(2);
  if (p < 10) return p.toFixed(1);
  return String(Math.round(p));
}

export function StorageUsageCard({ stats }: StorageUsageCardProps) {
  const percentRaw =
    stats.total > 0 && Number.isFinite(stats.used)
      ? Math.min(100, (stats.used / stats.total) * 100)
      : 0;
  /** 아주 작은 사용량도 막대에 보이도록 */
  const barPercent =
    percentRaw > 0 ? Math.min(100, Math.max(percentRaw, 0.35)) : 0;
  const available = Math.max(0, stats.total - stats.used);
  const formatValue = (value: number) => formatStorageAmount(value, stats.unit);

  return (
    <section className="
      bg-white
      border
      border-border
      rounded-2xl
      shadow-sm
      p-6
      flex
      flex-col
      gap-4
    ">
      <header className="flex items-start gap-3">
        <img src={storageIcon} alt="Storage usage" className="h-12 w-12" />
        <div className="flex flex-col">
          <h3 className="text-base font-playfair text-text-primary">File Upload Capacity</h3>
          <p className="text-sm text-text-secondary font-inter">Monitor your document storage usage</p>
        </div>
      </header>

      <div className="flex items-center justify-between text-sm text-text-primary font-inter">
        <span>Storage Used</span>
        <span>{formatValue(stats.used)} / {formatValue(stats.total)}</span>
      </div>
      <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{ width: `${barPercent}%` }}
          aria-label={`Used ${formatPercentUsed(stats.used, stats.total)}% of storage`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-text-primary font-inter">
        <span>{formatPercentUsed(stats.used, stats.total)}% used</span>
        <span>{formatValue(available)} available</span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-background-light/30 border-border border-2 rounded-xl p-4 text-center">
        <div>
          <p className="text-2xl text-text-primary font-inter">{formatValue(stats.used)}</p>
          <p className="text-xs text-text-secondary font-inter">used</p>
        </div>
        <div>
          <p className="text-2xl text-text-primary font-inter">{formatValue(available)}</p>
          <p className="text-xs text-text-secondary font-inter">available</p>
        </div>
      </div>

      <div className="flex gap-2 text-sm text-text-secondary font-inter bg-background-light/30 border-border border-2 rounded-xl py-3 px-6">
        <p className="flex-1">{stats.description}</p>
      </div>
    </section>
  );
}
