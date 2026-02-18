import { useRef, useState } from "react";
import CameraButtonIcon from "../assets/CameraButtonIcon.svg";
import type { UserProfile } from "../types";
import NameIcon from "../assets/nameIcon.svg";
import MailIcon from "../assets/emailIcon.svg";

type ProfileCardProps = {
  user: UserProfile;
  onEditPhoto?: () => void;
  onImageChange?: (imageUrl: string) => void;
};

const PROFILE_IMAGE_KEY = 'profileImage';

export function ProfileCard({ user, onEditPhoto, onImageChange }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(
    user.profileImageUrl || localStorage.getItem(PROFILE_IMAGE_KEY)
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // FileReader를 사용하여 이미지를 base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setProfileImage(imageUrl);
      localStorage.setItem(PROFILE_IMAGE_KEY, imageUrl);
      onImageChange?.(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
    onEditPhoto?.();
  };

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
        <div className="relative">
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
            border-2
            border-white
            overflow-hidden
          ">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.initials}</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={handleCameraClick}
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
              z-10
              shadow-md
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
