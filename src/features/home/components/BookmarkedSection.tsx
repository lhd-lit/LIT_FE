import { StudyCard } from "../../../shared/components/StudyCard";
import type { Card, BrainStormingCard } from "../types"
import type { ReactNode } from "react";

type BookmarkedSectionProps = {
  title: string;
  cards: Card[];
  renderBookmarkedMetaData?: (card: BrainStormingCard) => ReactNode;
  /** 카드 클릭 시 (예: Self Study → 학습 화면으로 이동) */
  onBookmarkedCardClick?: (card: Card) => void;
};

export function BookmarkedSection({
  title,
  cards,
  renderBookmarkedMetaData,
  onBookmarkedCardClick,
}: BookmarkedSectionProps) {
    // null이나 undefined 항목 필터링
    const validCards = (cards || []).filter((card) => card != null && card.id != null);

    return (
        <div className="w-full p-6">
            <h3 className="
                font-playfair
                text-lg
                text-text-secondary
                mb-4
                pl-2"
            >
                Favorite {title}
            </h3>

            {validCards.length === 0 ? (
                <div className="text-sm text-text-secondary font-inter">
                    북마크한 항목이 없습니다.
                </div>
            ) : (
                <div className="
                    grid 
                    grid-cols-1
                    md:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                ">
                    {validCards.map((card) => (
                        <div
                            key={card.id}
                            className={onBookmarkedCardClick ? "cursor-pointer" : undefined}
                            onClick={
                              onBookmarkedCardClick
                                ? () => onBookmarkedCardClick(card)
                                : undefined
                            }
                            onKeyDown={
                              onBookmarkedCardClick
                                ? (e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      onBookmarkedCardClick(card);
                                    }
                                  }
                                : undefined
                            }
                            role={onBookmarkedCardClick ? "button" : undefined}
                            tabIndex={onBookmarkedCardClick ? 0 : undefined}
                            aria-label={
                              onBookmarkedCardClick
                                ? `Open ${card.title}`
                                : undefined
                            }
                        >
                            <StudyCard card={card} variant="grid">
                                {renderBookmarkedMetaData?.(card as BrainStormingCard)}
                            </StudyCard>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
