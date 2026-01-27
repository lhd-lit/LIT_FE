import type { ReactNode } from "react";
import type { Card } from "../types";
import { CardMenu } from "../../../shared/components/CardMenu";

type CardLayout = "horizontal" | "grid";

export type CardMetadata = {
  lastOpened?: string;
};

type StudyCardProps = {
  variant: CardLayout;
  card: Card;
  actionLabel?: string;
  metadata?: CardMetadata;
  children?: ReactNode;
  onAddToFavorites?: () => void;
  onDelete?: () => void;
};

export function StudyCard({
  variant,
  card,
  actionLabel,
  metadata,
  children,
  onAddToFavorites,
  onDelete,
}: StudyCardProps) {
  const isHorizontal = variant === "horizontal";
  const lastOpened = metadata?.lastOpened;

  const handleAddToFavorites = () => {
    onAddToFavorites?.();
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <div
      className={`rounded-2xl bg-white border-2 border-[#5A4A3A26] shadow-sm transition relative ${
        isHorizontal ? "flex" : "hover:shadow-md cursor-pointer"
      }`}
    >
      <img
        src={card.thumbnail}
        alt={`${card.title} by ${card.author}`}
        className={`object-cover ${
          isHorizontal ? "w-32 h-44 border-transparent rounded-l-2xl" : "rounded-t-2xl w-full h-40"
        }`}
      />

      <div className={`flex flex-col ${isHorizontal ? "justify-start pl-6 mt-6" : "p-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-playfair text-base text-[#2A2418] flex-1">{card.title}</h4>
          {!isHorizontal && (
            <CardMenu onAddToFavorites={handleAddToFavorites} onDelete={handleDelete} />
          )}
        </div>

        <p className="font-inter text-xs text-[#6B5D4F] mt-2">{card.author}</p>

        {children}

        {!isHorizontal && lastOpened && (
          <div className="flex items-center gap-2 mt-4 text-xs text-[#6B5D4F] font-inter">
            <span className="inline-block h-2 w-2 rounded-full bg-[#5A4A3A]" aria-hidden="true" />
            <span>{lastOpened}</span>
          </div>
        )}

        {isHorizontal && (
          <button className="bg-[#5A4A3A] rounded-lg justify-center text-[#FAF8F4] text-sm px-3 py-1.5 mt-6">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
