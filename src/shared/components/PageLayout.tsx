import { useState } from "react";
import type { ReactNode } from "react";
import { SearchBar } from "./SearchBar";
import { UploadButton } from "../../features/focusing/components/UploadButton";
import { UploadWorkModal } from "./UploadWorkModal";
import { BackButton } from "./NavigationButtons";

type PageLayoutProps = {
  title: string;
  description: string;
  icon?: string;
  iconAlt?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
  children: ReactNode;
  enableUpload?: boolean;
  backTo?: string;
  uploadModalHeading?: string;
  uploadModalSubheading?: string;
  uploadModalLabel?: string;
  onUploadSubmit?: (payload: { title: string; description: string; file: File | null }) => void;
};

export function PageLayout({
  title,
  description,
  icon,
  iconAlt,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
  children,
  enableUpload = false,
  backTo,
  uploadModalHeading = "Upload Study",
  uploadModalSubheading = "Add a new document, PDF, or article",
  uploadModalLabel = "Upload Work",
  onUploadSubmit,
}: PageLayoutProps) {
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleCloseModal = () => setUploadOpen(false);
  const handleOpenModal = () => setUploadOpen(true);
  const handleSubmit = (payload: { title: string; description: string; file: File | null }) => {
    onUploadSubmit?.(payload);
    setUploadOpen(false);
  };

  const controlBarActions = (
    <div className="flex items-center gap-4">
      {actions}
      {enableUpload && <UploadButton onClick={handleOpenModal} />}
    </div>
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 pb-4 border-b border-border bg-white p-8">
          {backTo && (
            <div className="flex items-center">
              <BackButton to={backTo} />
            </div>
          )}
          <div>
            <div className="flex flex-row items-center gap-2">
              {icon && <img src={icon} alt={iconAlt || ""} />}
              <h1 className="heading-primary text-lg">{title}</h1>
            </div>
            {description && (
              <p className="text-body text-sm">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <SearchBar placeholder={searchPlaceholder} value={searchValue} onChange={onSearchChange} />
            {controlBarActions}
          </div>
        </div>

        {children}
      </div>

      {enableUpload && (
        <UploadWorkModal
          open={uploadOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          heading={uploadModalHeading}
          subheading={uploadModalSubheading}
          uploadLabel={uploadModalLabel}
        />
      )}
    </>
  );
}

