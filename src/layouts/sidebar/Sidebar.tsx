import { NavLink } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";
import HomeIcon from "../../shared/assets/homeIcon.svg";
import FocusingIcon from "../../shared/assets/focusingIcon.svg";
import BrainStormingIcon from "../../shared/assets/brainstormingIcon.svg";
import SettingsIcon from "../../shared/assets/settingsIcon.svg";

export function Sidebar() {
  return (
    <aside className="flex flex-col items-start w-64 min-h-screen border-r border-[#5A4A3A26] px-4 py-6 bg-[#F5F0E8]">
      <nav className="flex flex-col gap-2 w-full">
        <NavLink to="/home">
          {({ isActive }) => <SidebarItem iconSrc={HomeIcon} label="Home" active={isActive} />}
        </NavLink>

        <NavLink to="/focusing">
          {({ isActive }) => <SidebarItem iconSrc={FocusingIcon} label="Focusing" active={isActive} />}
        </NavLink>

        <NavLink to="/brainstorming">
          {({ isActive }) => (
            <SidebarItem iconSrc={BrainStormingIcon} label="Brain Storming" active={isActive} />
          )}
        </NavLink>

        <NavLink to="/settings">
          {({ isActive }) => <SidebarItem iconSrc={SettingsIcon} label="Settings" active={isActive} />}
        </NavLink>
      </nav>
    </aside>
  );
}
