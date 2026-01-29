import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import cardMenuDeleteIcon from "../assets/cardMenuDeleteIcon.svg";
import cardMenuFavoritesIcon from "../assets/cardMenuFavoritesIcon.svg";

type CardMenuProps = {
  onAddToFavorites: () => void;
  onDelete: () => void;
};

export function CardMenu({ onAddToFavorites, onDelete }: CardMenuProps) {
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
      // 메뉴 위치 계산
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
      className="fixed w-[180px] bg-white rounded-lg shadow-lg border border-border py-2 z-[100]"
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
          handleAddToFavorites();
        }}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-background transition text-left"
      >
        <img src={cardMenuFavoritesIcon} alt="add to favorites icon" className="w-5 h-5" aria-hidden="true" />
        <span className="text-sm font-inter text-text-primary">Add to Favorites</span>
      </button>

      <div className="border-t border-border my-1" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-background transition text-left"
      >
        <img src={cardMenuDeleteIcon} alt="delete icon" className="w-5 h-5" aria-hidden="true" />
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
        aria-label="More actions"
      >
        ⋮
      </button>
      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}


