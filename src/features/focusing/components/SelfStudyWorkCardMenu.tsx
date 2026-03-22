import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import cardMenuDeleteIcon from "../../../shared/assets/cardMenuDeleteIcon.svg";
import cardMenuFavoritesIcon from "../../../shared/assets/cardMenuFavoritesIcon.svg";

/**
 * Focusing SelfStudy 작품 카드 전용 ⋮ 메뉴 (북마크 / 삭제).
 * GroupStudy 작품 메뉴와 공유하지 않음 — 추후 Group 쪽은 별도 컴포넌트에서 모달 등 확장.
 */
type SelfStudyWorkCardMenuProps = {
  onAddToFavorites: () => void;
  onDelete: () => void;
  hideFavorites?: boolean;
  favoritesLabel?: string;
};

export function SelfStudyWorkCardMenu({
  onAddToFavorites,
  onDelete,
  hideFavorites = false,
  favoritesLabel = "Add to Favorites",
}: SelfStudyWorkCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 4,
          right: window.innerWidth - rect.right + window.scrollX,
        });
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleAddToFavorites = () => {
    onAddToFavorites();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  const menuContent = isOpen && (
    <div
      ref={menuRef}
      className="fixed w-[210px] bg-white rounded-lg shadow-lg border border-border py-2 z-[100]"
      style={{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {!hideFavorites && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToFavorites();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background transition text-left"
          >
            <img src={cardMenuFavoritesIcon} alt="" className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-inter text-text-primary leading-tight whitespace-nowrap">
              {favoritesLabel}
            </span>
          </button>

          <div className="border-t border-border my-1" />
        </>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-background transition text-left"
      >
        <img src={cardMenuDeleteIcon} alt="" className="w-5 h-5" aria-hidden="true" />
        <span className="text-sm font-inter text-red-600 whitespace-nowrap">Delete Document</span>
      </button>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleMenuToggle}
        onMouseDown={(e) => e.stopPropagation()}
        className="text-text-primary hover:text-primary transition px-1 hover:bg-background rounded-md py-1 hover:scale-110"
        aria-label="Self study work actions"
      >
        ⋮
      </button>
      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
