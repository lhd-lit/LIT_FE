import { useState } from "react";
import { getUserIdFromToken, logout } from "../../auth/api/auth.api";
import { deleteUserAccount } from "../api/userAccount.api";

const PROFILE_IMAGE_KEY = "profileImage";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

type DeleteAccountCardProps = {
  /** 로그인 계정 이메일 (JWT email 클레임) */
  email: string;
};

export function DeleteAccountCard({ email }: DeleteAccountCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = normalizeEmail(email);
  const matches = target.length > 0 && normalizeEmail(confirmEmail) === target;

  const closeModal = () => {
    setModalOpen(false);
    setConfirmEmail("");
    setError(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      closeModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (!matches || loading) return;

    const userId = getUserIdFromToken();
    if (userId == null) {
      setError("Could not read your account. Please sign in again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteUserAccount(userId);
      try {
        localStorage.removeItem(PROFILE_IMAGE_KEY);
      } catch {
        /* ignore */
      }
      logout();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg || "Account deletion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <section className="bg-white border border-border rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4 max-w-4xl mx-auto w-full">
        <h3 className="text-lg font-playfair text-text-primary">Delete Account</h3>
        <p className="text-sm text-center text-text-secondary font-inter max-w-xl">
          We couldn&apos;t load your account email. Please sign out and sign in again.
        </p>
      </section>
    );
  }

  return (
    <>
      <section
        className="
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
        max-w-4xl
        mx-auto
        w-full
      "
      >
        <h3 className="text-lg font-playfair text-text-primary">Delete Account</h3>
        <p className="text-sm text-center text-text-secondary font-inter max-w-xl">
          Permanently delete your account and all associated data.
        </p>
        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
            setConfirmEmail("");
            setError(null);
          }}
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

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div
            className="relative w-[480px] max-w-[90vw] rounded-2xl bg-background shadow-2xl border border-border-light px-6 py-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-modal-title"
          >
            <header className="flex items-start justify-between gap-2">
              <div>
                <h2
                  id="delete-account-modal-title"
                  className="text-lg font-playfair text-text-primary"
                >
                  Delete account
                </h2>
                <p className="text-sm text-text-secondary font-inter mt-1">
                  To confirm, enter the email address you used when you signed up.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !loading && closeModal()}
                disabled={loading}
                className="text-xl text-text-secondary hover:text-text-primary disabled:opacity-50"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>

            <div className="flex flex-col gap-2">
              <label htmlFor="modal-delete-email" className="text-sm font-inter text-text-primary">
                Email
              </label>
              <input
                id="modal-delete-email"
                type="email"
                autoComplete="off"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  setError(null);
                }}
                placeholder={email}
                className="w-full h-10 rounded-lg border-2 border-border px-3 text-sm text-text-primary font-inter placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-inter" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                disabled={loading}
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-inter text-text-primary bg-background-light hover:bg-background-hover transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!matches || loading}
                onClick={() => void handleConfirmDelete()}
                className="px-4 py-2 rounded-lg text-sm font-inter text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting…" : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
