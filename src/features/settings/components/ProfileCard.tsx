import CameraButtonIcon from "../assets/CameraButtonIcon.svg";
import type { UserProfile } from "../types";
import NameIcon from "../assets/nameIcon.svg";
import MailIcon from "../assets/emailIcon.svg";

type ProfileCardProps = {
  user: UserProfile;
  onEditPhoto?: () => void;
};

export function ProfileCard({ user, onEditPhoto }: ProfileCardProps) {
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
      gap-6
      items-center
    ">
      <div className="flex flex-col items-center gap-3">
        <div className="
          h-20
          w-20
          rounded-full
          bg-gradient-to-b
          from-background-card
          to-primary
          text-white
          flex
          items-center
          justify-center
          text-xl
          font-inter
          shadow
          relative
          border-2
          border-white
        ">
          <span>{user.initials}</span>
          <button
            type="button"
            onClick={onEditPhoto}
            className="
              flex
              items-center
              justify-center
              absolute
              -bottom-1
              -right-1
              h-8
              w-8
              rounded-full
              bg-primary
              border-2
              border-white
            "
            aria-label="Change profile photo"
          >
            <img src={CameraButtonIcon} alt="Change profile photo" className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-text-secondary font-inter">Click to edit photo</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <div className="h-9 w-9 rounded-full bg-background-hover text-primary flex items-center justify-center text-xs font-inter">
            <img src={NameIcon} alt="Name" className="h-4 w-4" />
          </div>
          <div className="flex-1 bg-background-light rounded-xl px-6 py-3 flex justify-between items-center">
            <span className="text-sm text-text-primary font-playfair">{user.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="h-9 w-9 rounded-full bg-background-hover text-primary flex items-center justify-center text-xs font-inter">
            <img src={MailIcon} alt="Mail" className="h-4 w-4" />
          </div>
          <div className="flex-1 bg-background-light rounded-xl px-6 py-3 flex justify-between gap-1">
            <span className="text-sm text-text-primary font-playfair">{user.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
