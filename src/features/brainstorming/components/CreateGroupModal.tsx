import { useState } from "react";
import type { FormEvent } from "react";
import searchIcon from "../../../shared/assets/searchIcon.svg";
import { useUserSearch } from "../hooks/useUserSearch";
import { convertUsersToMembers } from "../utils/users.utils";
import { useCreateGroup } from "../hooks/useCreateGroup";
import { useGroupsList } from "../hooks/useGroupsList";
import type { Member } from "../types";

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const { refetch } = useGroupsList();
  const { handleCreateGroup, loading: createLoading, error: createError } = useCreateGroup(() => {
    refetch();
    handleReset();
    onClose();
  });
  
  const { users, loading: searchLoading } = useUserSearch(
    searchQuery,
    selectedMembers
      .filter((m) => m && m.id)
      .map((m) => parseInt(m.id))
  );

  const availableMembers = convertUsersToMembers(users);

  const handleMemberSelect = (member: Member) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
      setSearchQuery("");
    }
  };

  const handleMemberRemove = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await handleCreateGroup({
        name: groupName,
        description: description || undefined,
      });
      // 성공 시 useCreateGroup의 onSuccess 콜백에서 처리됨
    } catch (err) {
      // 에러는 useCreateGroup에서 처리됨
    }
  };

  const handleReset = () => {
    setGroupName("");
    setDescription("");
    setSearchQuery("");
    setSelectedMembers([]);
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

      <div 
        className="relative w-[520px] max-w-[90vw] rounded-2xl bg-background shadow-2xl border border-border-light px-6 py-4 space-y-5"
        onClick={(e) => {
          // 모달 내부 클릭 시 이벤트 전파 방지 (모달이 닫히지 않도록)
          e.stopPropagation();
        }}
      >
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
              {searchLoading && (
                <span className="text-xs text-text-secondary">검색 중...</span>
              )}
            </div>

            {/* 검색 결과 표시 */}
            {searchQuery && availableMembers.length > 0 && (
              <div className="mt-2 border border-border rounded-lg bg-white shadow-sm max-h-40 overflow-y-auto">
                {availableMembers
                  .filter((member) => member && member.id)
                  .map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleMemberSelect(member)}
                      className="w-full px-3 py-2 text-left hover:bg-background-light flex items-center gap-2"
                    >
                      <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                        {member.initials}
                      </span>
                      <span className="text-sm text-text-primary">{member.name}</span>
                    </button>
                  ))}
              </div>
            )}

            {/* 선택된 멤버 표시 */}
            {selectedMembers.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedMembers
                  .filter((member) => member && member.id)
                  .map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex items-center gap-2 rounded-full bg-background-hover text-text-primary pl-1 pr-3 py-1 text-xs font-inter"
                    >
                      <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                        {member.initials}
                      </span>
                      {member.name}
                      <button
                        type="button"
                        onClick={() => handleMemberRemove(member.id)}
                        className="ml-1 hover:text-red-600"
                        aria-label={`Remove ${member.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {createError && (
            <div className="text-sm text-red-600 font-inter">
              {createError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={createLoading}
              className="px-4 py-2 rounded-lg text-sm font-inter text-text-primary bg-background-light hover:bg-background-hover transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-5 py-2 rounded-lg text-sm font-inter text-white bg-primary hover:bg-primary/90 transition disabled:opacity-50"
            >
              {createLoading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
