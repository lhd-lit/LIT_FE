import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";
import { RecentSection } from "./RecentSection";
import { BookmarkedSection } from "./BookmarkedSection";
import type { BrainStormingCard, Card } from "../types";

type StudySectionProps = {
  icon: string;
  title: string;
  description: string;
  /** 헤더 View All → 해당 탭 경로 */
  viewAllTo?: string;
  recentCard: Card | null;
  bookmarkedCards: Card[];
  actionLabel: string;
  /** 최근 항목 API 로딩 */
  recentLoading?: boolean;
  /** 최근 항목 API 오류 메시지 */
  recentError?: string | null;
  /** Recent 카드 CTA → 해당 학습/그룹 화면으로 이동 (문자열 경로) */
  recentContinuePath?: (card: Card) => string;
  /** `recentContinuePath` 대신 사용. 비동기 허용 (예: 문서 조회 후 이동) */
  onRecentContinue?: (card: Card) => void | Promise<void>;
  renderRecentMetaData?: (card: BrainStormingCard) => ReactNode;
  renderBookmarkedMetaData?: (card: BrainStormingCard) => ReactNode;
  /** Favorite 그리드 카드 클릭 (Focusing: Self Study 학습 화면 등) */
  onBookmarkedCardClick?: (card: Card) => void;
};

export function StudySection({
  icon,
  title,
  description,
  viewAllTo,
  recentCard,
  bookmarkedCards,
  actionLabel,
  recentLoading,
  recentError,
  recentContinuePath,
  onRecentContinue,
  renderRecentMetaData,
  renderBookmarkedMetaData,
  onBookmarkedCardClick,
}: StudySectionProps) {
  return (
    <section className="flex flex-col items-start gap-4 bg-white border border-border rounded-2xl mx-8">
      <SectionHeader icon={icon} title={title} description={description} viewAllTo={viewAllTo} />

      <RecentSection
        title={title}
        card={recentCard}
        actionLabel={actionLabel}
        loading={recentLoading}
        error={recentError}
        recentContinuePath={recentContinuePath}
        onRecentContinue={onRecentContinue}
        renderRecentMetaData={renderRecentMetaData}
      />

      <BookmarkedSection
        title={title}
        cards={bookmarkedCards}
        renderBookmarkedMetaData={renderBookmarkedMetaData}
        onBookmarkedCardClick={onBookmarkedCardClick}
      />
    </section>
  );
}