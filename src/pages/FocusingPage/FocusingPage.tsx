import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { SortDropdown } from "../../features/focusing/components/SortDropdown";
import { StudyCard } from "../../shared/components/StudyCard";
import focusingIcon from "../../shared/assets/focusingIcon.svg";
import { MOCK_FOCUSING_CARDS } from "../../mock/focusing/mockData";

export default function FocusingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleUploadSubmit = (_payload: { title: string; description: string; file: File | null }) => {
    // TODO: 실제 업로드 로직 구현
    // 업로드 후 새 문서 ID를 받아서 StudyPage로 이동
    const newDocumentId = "new-doc-1"; // 임시 ID
    navigate(`/focusing/study/${newDocumentId}`);
  };

  const handleCardClick = (cardId: string) => {
    navigate(`/focusing/study/${cardId}`);
  };

  return (
    <PageLayout
      title="Focusing"
      description="Continue your AI-assisted learning journey"
      icon={focusingIcon}
      iconAlt="focusing"
      searchPlaceholder="Search by title or author..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      actions={<SortDropdown />}
      enableUpload={true}
      onUploadSubmit={handleUploadSubmit}
    >
      <section className="bg-background shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {MOCK_FOCUSING_CARDS.map(({ card, metadata }) => (
            <div key={card.id} onClick={() => handleCardClick(card.id)} className="cursor-pointer">
              <StudyCard card={card} variant="grid" metadata={metadata} />
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
