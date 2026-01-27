import tokenIcon from "../assets/tokenIcon.svg";
import type { UsageStats } from "../types";

type TokenUsageCardProps = {
  stats: UsageStats;
};

export function TokenUsageCard({ stats }: TokenUsageCardProps) {
  const percentUsed = Math.min(100, Math.round((stats.used / stats.total) * 100));
  const remaining = stats.total - stats.used;

  return (
    <section className="
      bg-white
      border
      border-[#5A4A3A26]
      rounded-2xl
      shadow-sm
      p-6
      flex
      flex-col
      gap-4
    ">
      <header className="flex items-start gap-3">
        <img src={tokenIcon} alt="Token usage" className="h-12 w-12" />
        <div className="flex flex-col">
          <h3 className="text-base font-playfair text-[#2A2418]">Token Usage</h3>
          <p className="text-sm text-[#6B5D4F] font-inter">Track your AI assistant token consumption</p>
        </div>
      </header>

      <div className="flex items-center justify-between text-xs text-[#2A2418] font-inter">
        <span>{stats.labelUsed}</span>
        <span>{stats.total.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-[#ECE4D7] overflow-hidden">
        <div
          className="h-full bg-[#5A4A3A]"
          style={{ width: `${percentUsed}%` }}
          aria-label={`Used ${percentUsed}% of tokens`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[#2A2418] font-inter">
        <span>{percentUsed}% used</span>
        <span>{remaining.toLocaleString()} remaining</span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-[#F5F0E84D] border-[#5A4A3A26] border-2 rounded-xl p-4 text-center">
        <div>
          <p className="text-2xl text-[#2A2418] font-inter">{stats.used.toLocaleString()}</p>
          <p className="text-xs text-[#6B5D4F] font-inter">Tokens Used</p>
        </div>
        <div>
          <p className="text-2xl text-[#2A2418] font-inter">{remaining.toLocaleString()}</p>
          <p className="text-xs text-[#6B5D4F] font-inter">Tokens Remaining</p>
        </div>
      </div>

      <div className="flex gap-2 text-sm text-[#6B5D4F] font-inter bg-[#D4C4A833] border-[#D4C4A8] border-2 rounded-xl px-6 py-3">
        <p className="flex-1">{stats.description}</p>
      </div>
    </section>
  );
}
