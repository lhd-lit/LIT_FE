import { StudyCard } from "../../../shared/components/StudyCard";
import type { Card, BrainStormingCard } from "../types"
import type { ReactNode } from "react";

type BookmarkedSectionProps = {

    title : string;
    cards : Card[];
    renderBookmarkedMetaData?: (card: BrainStormingCard) => ReactNode;

}

export function BookmarkedSection({ title, cards, renderBookmarkedMetaData }: BookmarkedSectionProps) {
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
                        <StudyCard key={card.id} card={card} variant="grid">
                            {renderBookmarkedMetaData?.(card as BrainStormingCard)}
                        </StudyCard>
                    ))}
                </div>
            )}
        </div>
    );
}
