type DeleteAccountCardProps = {
  onDelete?: () => void;
};

export function DeleteAccountCard({ onDelete }: DeleteAccountCardProps) {
  return (
    <section className="
      bg-white
      border
      border-border
      rounded-2xl
      shadow-sm
      p-6
      flex
      flex-col
      items-center
      gap-4
    ">
      <h3 className="text-lg font-playfair text-text-primary">Delete Account</h3>
      <p className="text-sm text-center text-text-secondary font-inter max-w-xl">
        Permanently delete your account and all associated data.
      </p>
      <button
        onClick={onDelete}
        className="
          px-5
          py-2.5
          rounded-lg
          bg-primary
          text-white
          text-sm
          font-inter
          hover:bg-primary/90
          transition
        "
      >
        Permanently delete my account
      </button>
    </section>
  );
}
