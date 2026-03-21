import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";
import { RecentSection } from "./RecentSection";
import { BookmarkedSection } from "./BookmarkedSection";
import type { BrainStormingCard, Card } from "../types";

type StudySectionProps = {
  icon: string;
  title: string;
  description: string;
  recentCard: Card | null;
  bookmarkedCards: Card[];
  actionLabel: string;
  /** 최근 항목 API 로딩 */
  recentLoading?: boolean;
  /** 최근 항목 API 오류 메시지 */
  recentError?: string | null;
  /** Recent 카드 CTA → 해당 학습/그룹 화면으로 이동 */
  recentContinuePath?: (card: Card) => string;
  renderRecentMetaData?: (card: BrainStormingCard) => ReactNode;
  renderBookmarkedMetaData?: (card: BrainStormingCard) => ReactNode;
};

export function StudySection({
  icon,
  title,
  description,
  recentCard,
  bookmarkedCards,
  actionLabel,
  recentLoading,
  recentError,
  recentContinuePath,
  renderRecentMetaData,
  renderBookmarkedMetaData,
}: StudySectionProps) {
  return (
    <section className="flex flex-col items-start gap-4 bg-white border border-border rounded-2xl mx-8">
      <SectionHeader icon={icon} title={title} description={description} />

      <RecentSection
        title={title}
        card={recentCard}
        actionLabel={actionLabel}
        loading={recentLoading}
        error={recentError}
        recentContinuePath={recentContinuePath}
        renderRecentMetaData={renderRecentMetaData}
      />

      <BookmarkedSection
        title={title}
        cards={bookmarkedCards}
        renderBookmarkedMetaData={renderBookmarkedMetaData}
      />
    </section>
  );
}