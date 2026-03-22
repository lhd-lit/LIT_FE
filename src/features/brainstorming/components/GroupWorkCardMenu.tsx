import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import cardMenuDeleteIcon from "../../../shared/assets/cardMenuDeleteIcon.svg";
import cardMenuFavoritesIcon from "../../../shared/assets/cardMenuFavoritesIcon.svg";

/**
 * 스터디 그룹 작품(Group work) 카드 전용 ⋮ 메뉴.
 * SelfStudyWorkCardMenu와 UI 패턴은 비슷하되 파일·도메인 분리 (공용 컴포넌트 아님).
 * 즐겨찾기는 백엔드 API 없이 localStorage(`groupDocumentBookmarks`) 사용.
 */
type GroupWorkCardMenuProps = {
  onToggleFavorite: () => void;
  isFavorite: boolean;
  favoritesLabel?: string;
  onDelete: () => void;
};

export function GroupWorkCardMenu({
  onToggleFavorite,
  isFavorite,
  favoritesLabel,
  onDelete,
}: GroupWorkCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const label =
    favoritesLabel ??
    (isFavorite ? "Remove from Favorites" : "Add to Favorites");

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

  const handleFavorite = () => {
    onToggleFavorite();
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
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background transition text-left"
      >
        <img src={cardMenuFavoritesIcon} alt="" className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="text-xs font-inter text-text-primary leading-tight whitespace-nowrap">
          {label}
        </span>
      </button>

      <div className="border-t border-border my-1" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background transition text-left"
      >
        <img src={cardMenuDeleteIcon} alt="" className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="text-xs font-inter text-red-600 whitespace-nowrap">Delete Document</span>
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
        aria-label="Group work actions"
      >
        ⋮
      </button>
      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
