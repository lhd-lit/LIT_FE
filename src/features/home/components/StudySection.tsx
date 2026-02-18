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