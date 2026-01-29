import storageIcon from "../assets/storageIcon.svg";
import type { StorageStats } from "../types";

type StorageUsageCardProps = {
  stats: StorageStats;
};

export function StorageUsageCard({ stats }: StorageUsageCardProps) {
  const percentUsed = Math.min(100, Math.round((stats.used / stats.total) * 100));
  const available = stats.total - stats.used;

  const formatValue = (value: number) => `${value} ${stats.unit}`;

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
          style={{ width: `${percentUsed}%` }}
          aria-label={`Used ${percentUsed}% of storage`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-text-primary font-inter">
        <span>{percentUsed}% used</span>
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
