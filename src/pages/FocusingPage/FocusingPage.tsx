import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { SortDropdown } from "../../features/focusing/components/SortDropdown";
import { StudyCard } from "../../shared/components/StudyCard";
import { useSelfStudyList } from "../../features/focusing/hooks/useSelfStudyList";
import { useSelfStudyUpload } from "../../features/focusing/hooks/useSelfStudyUpload";
import focusingIcon from "../../shared/assets/focusingIcon.svg";

export default function FocusingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { cards, loading, error } = useSelfStudyList();
  const { handleUpload } = useSelfStudyUpload();

  const handleUploadSubmit = async (payload: { title: string; description: string; file: File | null }) => {
    try {
      await handleUpload(payload);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCardClick = (cardId: string) => {
    navigate(`/focusing/study/${cardId}`);
  };

  const filteredCards = useMemo(() => {
    // null이나 undefined 항목을 먼저 필터링
    const validCards = (cards || []).filter(
      (item) => item && item.card && item.card.id
    );
    
    if (!searchQuery.trim()) return validCards;
    const query = searchQuery.toLowerCase();
    return validCards.filter(({ card }) =>
      card &&
      card.id &&
      (card.title?.toLowerCase().includes(query) ||
        card.author?.toLowerCase().includes(query))
    );
  }, [cards, searchQuery]);

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
        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-sm font-inter">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-sm font-inter text-red-600">{error}</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-sm font-inter">
              {searchQuery ? "검색 결과가 없습니다." : "작품이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredCards.map(({ card, metadata }) => 
              card && card.id ? (
                <div key={card.id} onClick={() => handleCardClick(card.id)} className="cursor-pointer">
                  <StudyCard card={card} variant="grid" metadata={metadata} />
                </div>
              ) : null
            )}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
