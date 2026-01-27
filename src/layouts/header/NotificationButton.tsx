import { useState } from "react";
import AlertIcon from "@/layouts/assets/alertIcon.svg";
import { NotificationPanel } from "./notifications/NotificationPanel";
import { MOCK_NOTIFICATIONS } from "../../mock/notifications/mockData";

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full transition hover:bg-[#FAF8F4] p-2 hover:scale-110"
        aria-label="Notifications"
      >
        <div className="relative">
          <img src={AlertIcon} className="w-5 h-5" alt="notifications" />

          {unreadCount > 0 && (
            <span className="absolute top-[-10px] right-[-10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#6B3E2E] text-white text-[11px] font-medium">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={handleClose}
        />
      )}
    </>
  );
}