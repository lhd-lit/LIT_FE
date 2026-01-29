import { NotificationIcon } from "./NotificationIcon";
import type { Notification } from "./types";

type NotificationPanelProps = {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClose: () => void;
};

export function NotificationPanel({
  notifications,
  onMarkAllAsRead,
  onClose,
}: NotificationPanelProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="absolute top-16 right-8 w-[420px] max-w-[calc(100vw-4rem)] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-playfair text-text-primary">Notifications</h2>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-sm font-inter text-primary hover:text-text-primary transition"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto pb-8">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <p className="text-sm font-inter text-text-secondary">No notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type NotificationItemProps = {
  notification: Notification;
};

function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div
      className={`flex items-start gap-4 px-6 py-4 border-b border-gray-100 hover:bg-background transition cursor-pointer ${
        !notification.isRead ? "bg-white" : "bg-background"
      }`}
    >
      <div className="flex-shrink-0 mt-1">
        <NotificationIcon type={notification.type} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-sm font-inter font-medium text-text-primary mb-1">
              {notification.title}
            </h3>
            <p className="text-sm font-inter text-text-secondary mb-2">
              {notification.description}
            </p>
            <p className="text-xs font-inter text-text-tertiary">{notification.timestamp}</p>
          </div>

          {!notification.isRead && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
          )}
        </div>
      </div>
    </div>
  );
}

