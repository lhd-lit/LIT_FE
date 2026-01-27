import commentIcon from "./assets/commentIcon.svg";
import groupStudyIcon from "./assets/groupStudyIcon.svg";
import type { NotificationType } from "./types";

type NotificationIconProps = {
  type: NotificationType;
  className?: string;
};

export function NotificationIcon({ type, className = "w-4 h-4" }: NotificationIconProps) {
  if (type === "comment") {
    return <img src={commentIcon} alt="comment" className={className} />;
  }

  if (type === "group_invite") {
    return <img src={groupStudyIcon} alt="group invite" className={className} />;
  }

  return null;
}


