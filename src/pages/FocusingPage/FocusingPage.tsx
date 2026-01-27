import { useState } from "react";
import { ControlBar } from "../../shared/components/ControlBar";
import { SortDropdown } from "../../features/focusing/components/SortDropdown";
import { UploadButton } from "../../features/focusing/components/UploadButton";
import { StudyCard } from "../../features/home/components/StudyCard";
import focusingIcon from "../../shared/assets/focusingIcon.svg";
import { UploadWorkModal } from "../../shared/components/UploadWorkModal";
import { MOCK_FOCUSING_CARDS } from "../../mock/focusing/mockData";

export default function FocusingPage() {
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleCloseModal = () => setUploadOpen(false);
  const handleOpenModal = () => setUploadOpen(true);
  const handleSubmit = () => setUploadOpen(false);

  return (
    <>
      <div className="flex flex-col">
        <ControlBar
          title="Focusing"
          description="Continue your AI-assisted learning journey"
          icon={focusingIcon}
          iconAlt="focusing"
          searchPlaceholder="Search by title or author..."
          actions={
            <div className="flex items-center gap-4">
              <SortDropdown />
              <UploadButton onClick={handleOpenModal} />
            </div>
          }
        />

        <section className="bg-[#FAF8F4] shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {MOCK_FOCUSING_CARDS.map(({ card, metadata }) => (
              <StudyCard key={card.id} card={card} variant="grid" metadata={metadata} />
            ))}
          </div>
        </section>
      </div>

      <UploadWorkModal
        open={uploadOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        heading="Upload Study"
        subheading="Add a new document, PDF, or article"
        uploadLabel="Upload Work"
      />
    </>
  );
}
