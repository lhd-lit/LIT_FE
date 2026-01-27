import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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

  const handleMenuToggle = () => {
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
      className="fixed w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
      style={{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }}
    >
      <button
        type="button"
        onClick={handleAddToFavorites}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#FAF8F4] transition text-left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#5A4A3A]"
        >
          <path
            d="M8 2L9.854 5.854L14 6.708L11 9.708L11.708 14L8 12.146L4.292 14L5 9.708L2 6.708L6.146 5.854L8 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className="text-sm font-inter text-[#2A2418]">Add to Favorites</span>
      </button>

      <div className="border-t border-gray-200 my-1" />

      <button
        type="button"
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#FAF8F4] transition text-left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-600"
        >
          <path
            d="M2 4H14M12.667 4V13.333C12.667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68695 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66667 7.33333V11.3333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.33333 7.33333V11.3333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-inter text-red-600">Delete Document</span>
      </button>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleMenuToggle}
        className="text-[#2A2418] hover:text-[#5A4A3A] transition px-1 hover:bg-[#FAF8F4] rounded-md py-1 hover:scale-110"
        aria-label="More actions"
      >
        ⋮
      </button>
      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}


