import membersIcon from "../../../shared/assets/membersIcon.svg";
import workingIcon from "../../../shared/assets/workingIcon.svg";
import type { StudyGroup } from "../types";

type GroupCardProps = {
  group: StudyGroup;
};

const MAX_VISIBLE_PARTICIPANTS = 5;

export function GroupCard({ group }: GroupCardProps) {
  const visibleParticipants = group.participants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const extraCount = Math.max(0, group.participants.length - MAX_VISIBLE_PARTICIPANTS);

  return (
    <article className="bg-white border border-[#5A4A3A26] rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="font-playfair text-lg text-[#2A2418]">{group.title}</h3>
            {group.newCount !== undefined && group.newCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#5A4A3A] text-white text-xs px-3 py-1 font-inter">
                {group.newCount} new
              </span>
            )}
          </div>
          <p className="font-inter text-sm text-[#6B5D4F]">{group.description}</p>
        </div>
        <button
          type="button"
          aria-label="More actions"
          className="text-[#2A2418] hover:text-[#5A4A3A] transition px-1"
        >
          ⋮
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-6 text-sm text-[#2A2418] font-inter">
        <div className="flex items-center gap-2">
          <img src={membersIcon} alt="members" />
          <span>{group.members} members</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={workingIcon} alt="works" />
          <span>{group.works} works</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#5A4A3A]" aria-hidden="true" />
          <span>{group.updatedAgo}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          {visibleParticipants.map((initials, index) => (
            <span
              key={`${initials}-${index}`}
              className={`h-8 w-8 rounded-full bg-[#5A4A3A] border-2 border-white text-white flex items-center justify-center text-xs font-inter ${
                index > 0 ? "-ml-2" : ""
              }`}
            >
              {initials}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="h-8 w-8 rounded-full bg-[#D9CBB1] text-[#2A2418] flex items-center justify-center text-xs font-inter -ml-1">
              +{extraCount}
            </span>
          )}
        </div>

        <p className="font-inter text-xs text-[#6B5D4F]">Created by {group.owner}</p>
      </div>
    </article>
  );
}
