import createGroupIcon from "../assets/createGroupIcon.svg";

type CreateGroupButtonProps = {
  onClick?: () => void;
};

export function CreateGroupButton({ onClick }: CreateGroupButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-white text-sm font-inter hover:bg-primary/90 transition"
    >
      <img src={createGroupIcon} alt="create group" />
      Create Group
    </button>
  );
}


