import { useState } from "react";
import type { FormEvent } from "react";
import searchIcon from "../../../shared/assets/searchIcon.svg";
import { MOCK_MEMBERS } from "../../../mock/brainstorming/mockData";

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = MOCK_MEMBERS.filter(
    (member) =>
      !searchQuery ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.initials.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Hook up to API when available
    console.log("Creating group:", { groupName, description });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setGroupName("");
    setDescription("");
    setSearchQuery("");
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

      <div className="relative w-[520px] max-w-[90vw] rounded-2xl bg-[#FAF8F4] shadow-2xl border border-[#E6DFD2] px-6 py-4 space-y-5">
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-playfair text-[#2A2418]">
              Create Study Group
            </h2>
            <p className="text-sm text-[#6B5D4F] font-inter">
              Invite participants to join this collaborative reading session.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-[#6B5D4F] hover:text-[#2A2418]"
          >
            ×
          </button>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-inter text-[#2A2418]">
              Group Name
            </label>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Modernist Literature Study"
              className="w-full h-10 rounded-lg border-2 border-[#8B7355] px-3 text-sm text-[#2A2418] font-inter placeholder-[#9A8C7A] focus:outline-none focus:ring-2 focus:ring-[#5A4A3A] bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-[#2A2418]">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of study focus..."
              className="w-full h-10 rounded-lg border-2 border-[#8B7355] px-3 text-sm text-[#2A2418] font-inter placeholder-[#9A8C7A] focus:outline-none focus:ring-2 focus:ring-[#5A4A3A] bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-[#2A2418]">
              Invite Members
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-lg border-2 border-[#8B7355] bg-white">
              <img src={searchIcon} alt="search" className="h-4 w-4" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 text-sm text-[#2A2418] font-inter placeholder-[#9A8C7A] outline-none bg-transparent"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {filteredMembers.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center gap-2 rounded-full bg-[#EFE6D8] text-[#2A2418] pl-1 pr-3 py-1 text-xs font-inter"
                >
                  <span className="h-6 w-6 rounded-full bg-[#5A4A3A] text-white flex items-center justify-center text-xs">
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
              className="px-4 py-2 rounded-lg text-sm font-inter text-[#2A2418] bg-[#F4EEE2] hover:bg-[#E9E0D0] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-inter text-white bg-[#5A4A3A] hover:bg-[#4A3A2A] transition"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
