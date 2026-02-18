import { useState, type ReactNode } from "react";
import type { Card } from "../../features/home/types";
import { CardMenu } from "./CardMenu";
import defaultThumbnail from "../../mock/book1.jpg";

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
  const [imageError, setImageError] = useState(false);

  const handleAddToFavorites = () => {
    onAddToFavorites?.();
  };

  const handleDelete = () => {
    onDelete?.();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`card-base relative ${isHorizontal ? "flex" : "hover:shadow-md cursor-pointer"}`}
    >
      <img
        src={imageError ? defaultThumbnail : card.thumbnail}
        alt={`${card.title} by ${card.author}`}
        onError={handleImageError}
        className={`object-cover ${
          isHorizontal ? "w-32 h-44 border-transparent rounded-l-2xl" : "rounded-t-2xl w-full h-40"
        }`}
      />

      <div className={`flex flex-col ${isHorizontal ? "justify-start pl-6 mt-6" : "p-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <h4 className="heading-primary text-base flex-1">{card.title}</h4>
          {!isHorizontal && (
            <CardMenu onAddToFavorites={handleAddToFavorites} onDelete={handleDelete} />
          )}
        </div>

        <p className="text-body text-xs mt-2">{card.author}</p>

        {children}

        {!isHorizontal && lastOpened && (
          <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary font-inter">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{lastOpened}</span>
          </div>
        )}

        {isHorizontal && actionLabel && (
          <button className="btn-primary mt-6">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}



