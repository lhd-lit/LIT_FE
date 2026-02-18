import { useState } from "react";
import type { FormEvent } from "react";
import searchIcon from "../../../shared/assets/searchIcon.svg";
import { createGroup } from "../api/groups.api";

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // TODO: API 연동으로 멤버 목록 가져오기
  const filteredMembers: any[] = [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const name = groupName.trim();
    if (!name) {
      setSubmitError("Group Name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await createGroup({ name, description: description.trim() || undefined });
      handleReset();
      onClose();
    } catch (err: any) {
      // 백엔드는 GlobalResponse 구조로 에러를 반환
      const errorData = err?.response?.data;
      const message =
        errorData?.message || // GlobalResponse의 message 필드
        err?.message ||
        "Failed to create group. Please try again.";
      setSubmitError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGroupName("");
    setDescription("");
    setSearchQuery("");
    setSubmitError(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="relative w-[520px] max-w-[90vw] rounded-2xl bg-background shadow-2xl border border-border-light px-6 py-4 space-y-5">
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-playfair text-text-primary">
              Create Study Group
            </h2>
            <p className="text-sm text-text-secondary font-inter">
              Invite participants to join this collaborative reading session.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-text-secondary hover:text-text-primary"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-inter text-text-primary">
              Group Name
            </label>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Modernist Literature Study"
              className="w-full h-10 rounded-lg border-2 border-border px-3 text-sm text-text-primary font-inter placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-text-primary">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of study focus..."
              className="w-full h-10 rounded-lg border-2 border-border px-3 text-sm text-text-primary font-inter placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-text-primary">
              Invite Members
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-lg border-2 border-border bg-white">
              <img src={searchIcon} alt="search" className="h-4 w-4" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 text-sm text-text-primary font-inter placeholder-text-tertiary outline-none bg-transparent"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {filteredMembers.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center gap-2 rounded-full bg-background-hover text-text-primary pl-1 pr-3 py-1 text-xs font-inter"
                >
                  <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {member.initials}
                  </span>
                  {member.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-inter text-text-primary bg-background-light hover:bg-background-hover transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-sm font-inter text-white bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </div>

          {submitError && (
            <div className="text-sm text-red-600 font-inter" role="alert">
              {submitError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
