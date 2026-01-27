import { BrandSection } from "./BrandSection";
import { NotificationButton } from "./NotificationButton";
import { LogoutButton } from "./LogoutButton";
import { HeaderAvatar } from "./HeaderAvatar";

export function Header() {
  return (
    <header className="h-16 w-full px-8 flex items-center justify-between border-b border-gray-200 bg-white">
      <BrandSection />

      <div className="flex items-center gap-8">
        <NotificationButton />
        <LogoutButton />
        <HeaderAvatar />
      </div>
    </header>
  );
}