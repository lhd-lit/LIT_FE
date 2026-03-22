import type { ReactNode, KeyboardEvent } from "react";
import type { Card } from "../../features/home/types";
import pinnedIcon from "../assets/pinnedIcon.svg";

type CardLayout = "horizontal" | "grid";

export type CardMetadata = {
  lastOpened?: string;
};

type StudyCardProps = {
  variant: CardLayout;
  card: Card;
  /** 그리드 카드: 즐겨찾기 시 썸네일 우측 상단에 핀 아이콘 */
  isFavorite?: boolean;
  actionLabel?: string;
  /** 가로형: 카드 영역(썸네일·본문) 클릭 시 (CTA와 동일 동작에 쓰면 버튼은 stopPropagation 처리됨) */
  onCardClick?: () => void | Promise<void>;
  /** 가로형 Recent 카드에서 CTA 버튼 클릭 (없으면 버튼 미표시) */
  onActionClick?: () => void | Promise<void>;
  /** CTA 비동기 처리 중 (버튼 비활성) */
  actionBusy?: boolean;
  metadata?: CardMetadata;
  children?: ReactNode;
  /**
   * 그리드 카드 제목 행 오른쪽 메뉴 슬롯.
   * Focusing은 SelfStudyWorkCardMenu, 그룹 작품은 GroupWorkCardMenu 등 도메인별로 전달.
   */
  gridMenu?: ReactNode;
};

export function StudyCard({
  variant,
  card,
  isFavorite = false,
  actionLabel,
  onCardClick,
  onActionClick,
  actionBusy,
  metadata,
  children,
  gridMenu,
}: StudyCardProps) {
  const isHorizontal = variant === "horizontal";
  const lastOpened = metadata?.lastOpened;
  const showFavoritePin = !isHorizontal && isFavorite;
  const horizontalInteractive = isHorizontal && Boolean(onCardClick);

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!horizontalInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      void onCardClick?.();
    }
  };

  return (
    <div
      role={horizontalInteractive ? "button" : undefined}
      tabIndex={horizontalInteractive ? 0 : undefined}
      aria-label={horizontalInteractive ? `Open ${card.title}` : undefined}
      onClick={horizontalInteractive ? () => void onCardClick?.() : undefined}
      onKeyDown={handleCardKeyDown}
      className={`card-base relative ${isHorizontal ? "flex" : "hover:shadow-md cursor-pointer"} ${
        horizontalInteractive ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl" : ""
      }`}
    >
      <div
        className={
          isHorizontal ? "shrink-0" : "relative rounded-t-2xl overflow-hidden"
        }
      >
        <img
          src={card.thumbnail}
          alt={`${card.title} by ${card.author}`}
          className={`object-cover ${
            isHorizontal ? "w-32 h-44 border-transparent rounded-l-2xl" : "w-full h-40"
          }`}
        />
        {showFavoritePin && (
          <div
            className="absolute top-3 right-3 z-10 pointer-events-none"
            aria-hidden
          >
            <img src={pinnedIcon} alt="" className="w-10 h-10" />
          </div>
        )}
      </div>

      <div className={`flex flex-col ${isHorizontal ? "justify-start pl-6 mt-6" : "p-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <h4 className="heading-primary text-base flex-1">{card.title}</h4>
          {!isHorizontal && gridMenu}
        </div>

        <p className="text-body text-xs mt-2">{card.author}</p>

        {children}

        {!isHorizontal && lastOpened && (
          <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary font-inter">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{lastOpened}</span>
          </div>
        )}

        {isHorizontal && lastOpened && (
          <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary font-inter">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>Last opened: {lastOpened}</span>
          </div>
        )}

        {isHorizontal && actionLabel && onActionClick && (
          <button
            type="button"
            className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              void onActionClick();
            }}
            disabled={actionBusy}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}



