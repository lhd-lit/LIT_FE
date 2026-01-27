type DeleteAccountCardProps = {
  onDelete?: () => void;
};

export function DeleteAccountCard({ onDelete }: DeleteAccountCardProps) {
  return (
    <section className="
      bg-white
      border
      border-[#5A4A3A26]
      rounded-2xl
      shadow-sm
      p-6
      flex
      flex-col
      items-center
      gap-4
    ">
      <h3 className="text-lg font-playfair text-[#2A2418]">Delete Account</h3>
      <p className="text-sm text-center text-[#6B5D4F] font-inter max-w-xl">
        Permanently delete your account and all associated data.
      </p>
      <button
        onClick={onDelete}
        className="
          px-5
          py-2.5
          rounded-lg
          bg-[#5A4A3A]
          text-white
          text-sm
          font-inter
          hover:bg-[#4A3A2A]
          transition
        "
      >
        Permanently delete my account
      </button>
    </section>
  );
}
