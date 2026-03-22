import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import cardMenuFavoritesIcon from "../../../shared/assets/cardMenuFavoritesIcon.svg";
import { leaveGroup } from "../api/groups.api";
import { getApiErrorMessage } from "../../../shared/utils/apiError";
import type { StudyGroup } from "../types";

type GroupCardMenuProps = {
  group: StudyGroup;
  onLeaveSuccess?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

/**
 * 그룹 카드 ⋮ — 작품 카드 메뉴(GroupWorkCardMenu)와 동일하게 버튼 아래에 붙는 패널.
 */
export function GroupCardMenu({
  group,
  onLeaveSuccess,
  isFavorite = false,
  onToggleFavorite,
}: GroupCardMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    setIsOpen((prev) => !prev);
  };

  const handleLeave = async () => {
    if (!group?.id || loading) return;
    setLoading(true);
    setError(null);
    try {
      await leaveGroup(group.id);
      onLeaveSuccess?.();
      setIsOpen(false);
      navigate("/brainstorming");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not leave the group. You may be the owner."));
    } finally {
      setLoading(false);
    }
  };

  const menuContent = isOpen && (
    <div
      ref={menuRef}
      className="fixed w-[min(280px,calc(100vw-24px))] bg-white rounded-lg shadow-lg border border-border z-[100]"
      style={{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-card-menu-title"
    >
      {onToggleFavorite && (
        <div className="p-2 border-b border-border">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-background transition text-left"
            onClick={() => {
              onToggleFavorite();
              setIsOpen(false);
            }}
          >
            <img src={cardMenuFavoritesIcon} alt="" className="w-4 h-4 shrink-0" aria-hidden />
            <span className="text-xs font-inter text-text-primary">
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </span>
          </button>
        </div>
      )}

      <div className="p-3 border-b border-border">
        <p id="group-card-menu-title" className="text-sm font-inter font-medium text-text-primary line-clamp-2">
          {group.title}
        </p>
        <p className="text-xs text-text-secondary font-inter mt-1.5 leading-snug">
          Leave to remove from your list. Group owners cannot leave — transfer ownership or delete the group if needed.
        </p>
      </div>

      {error && (
        <p className="px-3 pt-2 text-xs text-red-600 font-inter" role="alert">
          {error}
        </p>
      )}

      <div className="p-2 flex flex-col gap-1">
        <div className="flex justify-end gap-2 flex-wrap">
          <button
            type="button"
            disabled={loading}
            onClick={() => !loading && setIsOpen(false)}
            className="px-3 py-1.5 rounded-md text-xs font-inter text-text-primary bg-background-light hover:bg-background-hover transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleLeave()}
            className="px-3 py-1.5 rounded-md text-xs font-inter text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Leaving…" : "Leave group"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Group menu"
        className="text-text-primary hover:text-primary transition px-1 hover:bg-background rounded-md py-1 hover:scale-110 shrink-0"
        onClick={handleMenuToggle}
        onMouseDown={(e) => e.stopPropagation()}
      >
        ⋮
      </button>
      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
