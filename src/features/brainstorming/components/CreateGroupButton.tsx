import createGroupIcon from "../assets/createGroupIcon.svg";

type CreateGroupButtonProps = {
  onClick?: () => void;
};

export function CreateGroupButton({ onClick }: CreateGroupButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#5A4A3A] text-white text-sm font-inter hover:bg-[#4A3A2A] transition"
    >
      <img src={createGroupIcon} alt="create group" />
      Create Group
    </button>
  );
}


