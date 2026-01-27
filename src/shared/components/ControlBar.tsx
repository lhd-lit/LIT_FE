import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";

type ControlBarProps = {
  title: string;
  description: string;
  icon?: string;
  iconAlt?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
};

export function ControlBar({
  title,
  description,
  icon,
  iconAlt,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
}: ControlBarProps) {
  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-[#5A4A3A26] bg-white p-8">
      <PageHeader title={title} description={description} icon={icon} iconAlt={iconAlt} />

      <div className="flex items-center gap-4">
        <SearchBar placeholder={searchPlaceholder} value={searchValue} onChange={onSearchChange} />
        {actions}
      </div>
    </div>
  );
}

