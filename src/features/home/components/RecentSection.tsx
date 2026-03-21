import { useNavigate } from "react-router-dom";
import { StudyCard } from "../../../shared/components/StudyCard";
import type { Card, BrainStormingCard } from "../types"
import type { ReactNode } from "react";

function formatLastViewed(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toLocaleString();
  } catch {
    return undefined;
  }
}

type RecentSectionProps = {
    card: Card | null;
    title: string;
    actionLabel: string;
    loading?: boolean;
    error?: string | null;
    recentContinuePath?: (card: Card) => string;
    renderRecentMetaData?: (card: BrainStormingCard) => ReactNode;
}

export function RecentSection({ card, title, actionLabel, loading, error, recentContinuePath, renderRecentMetaData }: RecentSectionProps) {
    const navigate = useNavigate();

    const heading = (
        <h3 className="
            font-playfair
            text-lg
            text-text-secondary
            mb-4
            pl-2"
        >
            Recent {title}
        </h3>
    );

    if (loading) {
        return (
            <div className="w-full p-6">
                {heading}
                <div className="text-sm text-text-secondary font-inter animate-pulse">
                    최근 항목을 불러오는 중…
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6">
                {heading}
                <div className="text-sm text-red-600 font-inter">
                    {error}
                </div>
            </div>
        );
    }

    if (!card || !card.id) {
        return (
            <div className="w-full p-6">
                {heading}
                <div className="text-sm text-text-secondary font-inter">
                    최근 조회한 항목이 없습니다.
                </div>
            </div>
        );
    }

    const lastOpened = formatLastViewed(card.lastViewedAt);
    const onContinue =
        recentContinuePath != null
            ? () => navigate(recentContinuePath(card))
            : undefined;

    return (
        <div className="w-full p-6">
            {heading}

            <StudyCard
                key={card.id}
                variant="horizontal"
                card={card}
                actionLabel={actionLabel}
                onActionClick={onContinue}
                metadata={lastOpened ? { lastOpened } : undefined}
            >
                {renderRecentMetaData?.(card as BrainStormingCard)}
            </StudyCard>
        </div>
    );
}
