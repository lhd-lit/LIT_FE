import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { SortDropdown } from "../../features/focusing/components/SortDropdown";
import { StudyCard } from "../../shared/components/StudyCard";
import focusingIcon from "../../shared/assets/focusingIcon.svg";

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
        {/* TODO: API 연동으로 데이터 가져오기 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* 데이터가 없을 때 표시할 메시지 */}
          <div className="col-span-full text-center py-12 text-text-secondary">
            <p className="text-sm font-inter">No study documents found</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
