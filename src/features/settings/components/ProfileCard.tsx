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
      border-[#5A4A3A26]
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
          from-[#D9CBB1]
          to-[#5A4A3A]
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
              bg-[#5A4A3A]
              border-2
              border-white
            "
            aria-label="Change profile photo"
          >
            <img src={CameraButtonIcon} alt="Change profile photo" className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-[#6B5D4F] font-inter">Click to edit photo</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <div className="h-9 w-9 rounded-full bg-[#EFE6D8] text-[#5A4A3A] flex items-center justify-center text-xs font-inter">
            <img src={NameIcon} alt="Name" className="h-4 w-4" />
          </div>
          <div className="flex-1 bg-[#F7F1E6] rounded-xl px-6 py-3 flex justify-between items-center">
            <span className="text-sm text-[#2A2418] font-playfair">{user.name}</span>
            <button
              type="button"
              className="
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-inter
                bg-[#EFE6D8]
                text-[#6B5D4F]
                border
                border-[#E2D7C4]
              "
            >
              Click to edit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="h-9 w-9 rounded-full bg-[#EFE6D8] text-[#5A4A3A] flex items-center justify-center text-xs font-inter">
            <img src={MailIcon} alt="Mail" className="h-4 w-4" />
          </div>
          <div className="flex-1 bg-[#F7F1E6] rounded-xl px-6 py-3 flex justify-between gap-1">
            <span className="text-sm text-[#2A2418] font-playfair">{user.email}</span>
            <span className="
              inline-flex
              w-fit
              items-center
              px-3
              py-1
              rounded-full
              text-xs
              font-inter
              bg-[#EFE6D8]
              text-[#6B5D4F]
              border
              border-[#E2D7C4]
            ">
              Email cannot be changed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
