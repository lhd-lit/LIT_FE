import { useNavigate } from "react-router-dom";
import membersIcon from "../../../shared/assets/membersIcon.svg";
import workingIcon from "../../../shared/assets/workingIcon.svg";
import pinnedIcon from "../../../shared/assets/pinnedIcon.svg";
import type { StudyGroup } from "../types";
import { GroupCardMenu } from "./GroupCardMenu";

type GroupCardProps = {
  group: StudyGroup;
  onLeaveSuccess?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  favoriteDisabled?: boolean;
};

const MAX_VISIBLE_PARTICIPANTS = 5;

export function GroupCard({
  group,
  onLeaveSuccess,
  isFavorite = false,
  onToggleFavorite,
  favoriteDisabled = false,
}: GroupCardProps) {
  const navigate = useNavigate();
  const favorite = !!group?.id && isFavorite;

  if (!group || !group.id) {
    return null;
  }

  const handleToggleFavorite = () => {
    if (favoriteDisabled) return;
    onToggleFavorite?.();
  };

  const visibleParticipants = (group.participants || []).slice(0, MAX_VISIBLE_PARTICIPANTS);
  const extraCount = Math.max(0, (group.participants || []).length - MAX_VISIBLE_PARTICIPANTS);

  const goToGroup = () => {
    navigate(`/brainstorming/group/${group.id}`);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={goToGroup}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToGroup();
          }
        }}
        className="relative block bg-white border border-border rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition cursor-pointer text-left w-full"
      >
        {favorite && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none" aria-hidden>
            <img src={pinnedIcon} alt="" className="w-9 h-9" />
          </div>
        )}
        <header className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="heading-primary text-lg">{group.title}</h3>
              {group.newCount !== undefined && group.newCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white text-xs px-3 py-1 font-inter">
                  {group.newCount} new
                </span>
              )}
            </div>
            <p className="font-inter text-sm text-text-secondary">{group.description}</p>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            <GroupCardMenu
              group={group}
              onLeaveSuccess={onLeaveSuccess}
              isFavorite={favorite}
              onToggleFavorite={handleToggleFavorite}
              favoriteDisabled={favoriteDisabled}
            />
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-6 text-sm text-text-primary font-inter pointer-events-none">
          <div className="flex items-center gap-2">
            <img src={membersIcon} alt="" />
            <span>{group.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={workingIcon} alt="" />
            <span>{group.works} works</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{group.updatedAgo}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pointer-events-none">
          <div className="flex items-center">
            {visibleParticipants.map((initials, index) => (
              <span
                key={`${initials}-${index}`}
                className={`h-8 w-8 rounded-full bg-primary border-2 border-white text-white flex items-center justify-center text-xs font-inter ${
                  index > 0 ? "-ml-2" : ""
                }`}
              >
                {initials}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="h-8 w-8 rounded-full bg-background-card text-text-primary flex items-center justify-center text-xs font-inter -ml-1">
                +{extraCount}
              </span>
            )}
          </div>

          <p className="font-inter text-xs text-text-secondary">Created by {group.owner}</p>
        </div>
      </div>
    </>
  );
}
