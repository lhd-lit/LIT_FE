import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { SortDropdown } from "../../features/focusing/components/SortDropdown";
import { StudyCard } from "../../shared/components/StudyCard";
import focusingIcon from "../../shared/assets/focusingIcon.svg";
import { createSelfStudy, getMySelfStudyList, deleteSelfStudy } from "../../features/focusing/api/selfStudy.api";
import { addBookmark } from "../../features/focusing/api/bookmark.api";
import type { Card } from "../../features/home/types";
import type { CardMetadata } from "../../shared/components/StudyCard";
import { generatePdfThumbnail } from "../../utils/pdfThumbnail";

export default function FocusingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<Array<{ card: Card; metadata?: CardMetadata }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUploadSubmit = async (payload: { title: string; description: string; file: File | null }) => {
    if (!payload.file) {
      alert("파일을 선택해주세요.");
      return;
    }

    if (!payload.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      // 백엔드 API를 통해 파일 업로드 및 SelfStudy 생성
      const response = await createSelfStudy(
        payload.title.trim(),
        payload.description?.trim() || undefined,
        payload.file
      );

      // 업로드 성공 후 새 문서 ID를 받아서 StudyPage로 이동
      navigate(`/focusing/study/${response.id}`);
    } catch (err: any) {
      // 에러 처리
      const errorData = err?.response?.data;
      const message =
        errorData?.message ||
        err?.message ||
        "파일 업로드에 실패했습니다. 다시 시도해주세요.";
      alert(message);
      console.error("Upload error:", err);
    }
  };

  // SelfStudy 목록 조회
  useEffect(() => {
    const fetchSelfStudyList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMySelfStudyList(0, 100); // 최대 100개 조회
        
        // 백엔드 응답을 Card 타입으로 변환 (썸네일 생성 포함)
        const convertedCardsPromises = response.content.map(async (item) => {
          let thumbnail: string;

          // 파일 확장자 확인
          const isImageFile = item.fileUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.fileUrl);
          const isPdfFile = item.fileUrl && /\.pdf$/i.test(item.fileUrl);

          if (isImageFile) {
            // 이미지 파일인 경우 직접 사용
            thumbnail = item.fileUrl;
          } else if (isPdfFile) {
            // PDF 파일인 경우 첫 페이지를 썸네일로 생성
            const pdfThumbnail = await generatePdfThumbnail(item.fileUrl);
            thumbnail = pdfThumbnail || item.fileUrl; // 실패 시 원본 URL 사용 (fallback)
          } else {
            // 기타 파일 형식은 원본 URL 사용
            thumbnail = item.fileUrl;
          }
          
          return {
            card: {
              id: item.id.toString(),
              title: item.title,
              author: item.writerName,
              thumbnail,
            } as Card,
            metadata: {
              // 필요시 추가 메타데이터 설정
            } as CardMetadata,
          };
        });

        // 모든 썸네일 생성이 완료될 때까지 대기
        const convertedCards = await Promise.all(convertedCardsPromises);
        setCards(convertedCards);
      } catch (err: any) {
        const errorData = err?.response?.data;
        const message =
          errorData?.message ||
          err?.message ||
          "작품 목록을 불러오는데 실패했습니다.";
        setError(message);
        console.error("Fetch self study list error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelfStudyList();
  }, []);

  const handleCardClick = (cardId: string) => {
    navigate(`/focusing/study/${cardId}`);
  };

  // 즐겨찾기 추가 핸들러
  const handleAddToFavorites = async (cardId: string) => {
    try {
      const selfStudyId = parseInt(cardId, 10);
      await addBookmark(selfStudyId);
      alert("즐겨찾기에 추가되었습니다.");
    } catch (err: any) {
      const errorData = err?.response?.data;
      const message =
        errorData?.message ||
        err?.message ||
        "즐겨찾기 추가에 실패했습니다.";
      alert(message);
      console.error("Add bookmark error:", err);
    }
  };

  // 작품 삭제 핸들러
  const handleDelete = async (cardId: string) => {
    if (!confirm("정말 이 작품을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const selfStudyId = parseInt(cardId, 10);
      await deleteSelfStudy(selfStudyId);
      
      // 삭제 성공 후 목록에서 제거
      setCards((prevCards) => prevCards.filter(({ card }) => card.id !== cardId));
      alert("작품이 삭제되었습니다.");
    } catch (err: any) {
      const errorData = err?.response?.data;
      const message =
        errorData?.message ||
        err?.message ||
        "작품 삭제에 실패했습니다.";
      alert(message);
      console.error("Delete self study error:", err);
    }
  };

  // 검색 필터링
  const filteredCards = cards.filter(({ card }) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.author.toLowerCase().includes(query)
    );
  });

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
            {filteredCards.map(({ card, metadata }) => (
              <div
                key={card.id}
                onClick={(e) => {
                  // 메뉴 영역 클릭 시에는 카드 클릭 이벤트 방지
                  const target = e.target as HTMLElement;
                  if (target.closest('[data-menu-button]') || target.closest('[data-menu-content]')) {
                    return;
                  }
                  handleCardClick(card.id);
                }}
                className="cursor-pointer"
              >
                <StudyCard
                  card={card}
                  variant="grid"
                  metadata={metadata}
                  onAddToFavorites={() => handleAddToFavorites(card.id)}
                  onDelete={() => handleDelete(card.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
