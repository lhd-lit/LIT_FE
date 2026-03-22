import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { SortDropdown } from "../../features/focusing/components/SortDropdown";
import { StudyCard } from "../../shared/components/StudyCard";
import { SelfStudyWorkCardMenu } from "../../features/focusing/components/SelfStudyWorkCardMenu";
import { useSelfStudyList } from "../../features/focusing/hooks/useSelfStudyList";
import { useSelfStudyUpload } from "../../features/focusing/hooks/useSelfStudyUpload";
import {
  getBookmarkList,
  createSelfStudyBookmark,
  deleteSelfStudyBookmark,
} from "../../features/focusing/api/bookmark.api";
import { deleteSelfStudy } from "../../features/focusing/api/selfStudy.api";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import focusingIcon from "../../shared/assets/focusingIcon.svg";
import type { Card } from "../../features/home/types";
import type { CardMetadata } from "../../shared/components/StudyCard";

const CARD_GRID =
  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6";

export default function FocusingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { cards, loading, error, refetch } = useSelfStudyList();
  const { handleUpload } = useSelfStudyUpload();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getBookmarkList(0, 100);
        const ids = new Set((page.content || []).map((b) => b.selfStudyId));
        if (!cancelled) setBookmarkedIds(ids);
      } catch {
        if (!cancelled) setBookmarkedIds(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleBookmarkToggle = async (cardId: string) => {
    const id = Number(cardId);
    if (!Number.isFinite(id)) return;
    const isBookmarked = bookmarkedIds.has(id);
    try {
      if (isBookmarked) {
        await deleteSelfStudyBookmark(id);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await createSelfStudyBookmark(id);
        setBookmarkedIds((prev) => new Set(prev).add(id));
      }
    } catch (e) {
      alert(getApiErrorMessage(e, "즐겨찾기를 처리하지 못했습니다."));
    }
  };

  const handleDeleteSelfStudy = async (cardId: string) => {
    const id = Number(cardId);
    if (!Number.isFinite(id)) return;
    try {
      await deleteSelfStudy(id);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      refetch();
    } catch (e) {
      alert(getApiErrorMessage(e, "삭제에 실패했습니다."));
    }
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

  const { favoriteItems, restItems } = useMemo(() => {
    type Row = { card: Card; metadata?: CardMetadata };
    const fav: Row[] = [];
    const rest: Row[] = [];
    for (const item of filteredCards) {
      if (!item?.card?.id) continue;
      if (bookmarkedIds.has(Number(item.card.id))) fav.push(item);
      else rest.push(item);
    }
    return { favoriteItems: fav, restItems: rest };
  }, [filteredCards, bookmarkedIds]);

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
        ) : favoriteItems.length > 0 ? (
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className={CARD_GRID}>
              {favoriteItems.map(({ card, metadata }) =>
                card?.id ? (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="cursor-pointer"
                    role="presentation"
                  >
                    <StudyCard
                      card={card}
                      variant="grid"
                      metadata={metadata}
                      isFavorite={bookmarkedIds.has(Number(card.id))}
                      gridMenu={
                        <SelfStudyWorkCardMenu
                          onAddToFavorites={() => handleBookmarkToggle(card.id)}
                          onDelete={() => handleDeleteSelfStudy(card.id)}
                          favoritesLabel={
                            bookmarkedIds.has(Number(card.id))
                              ? "Remove from Favorites"
                              : "Add to Favorites"
                          }
                        />
                      }
                    />
                  </div>
                ) : null
              )}
            </div>
            {restItems.length > 0 && (
              <div className={CARD_GRID}>
                {restItems.map(({ card, metadata }) =>
                  card?.id ? (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className="cursor-pointer"
                      role="presentation"
                    >
                      <StudyCard
                        card={card}
                        variant="grid"
                        metadata={metadata}
                        isFavorite={bookmarkedIds.has(Number(card.id))}
                        gridMenu={
                          <SelfStudyWorkCardMenu
                            onAddToFavorites={() => handleBookmarkToggle(card.id)}
                            onDelete={() => handleDeleteSelfStudy(card.id)}
                            favoritesLabel={
                              bookmarkedIds.has(Number(card.id))
                                ? "Remove from Favorites"
                                : "Add to Favorites"
                            }
                          />
                        }
                      />
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={CARD_GRID}>
            {filteredCards.map(({ card, metadata }) =>
              card?.id ? (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="cursor-pointer"
                  role="presentation"
                >
                  <StudyCard
                    card={card}
                    variant="grid"
                    metadata={metadata}
                    isFavorite={bookmarkedIds.has(Number(card.id))}
                    gridMenu={
                      <SelfStudyWorkCardMenu
                        onAddToFavorites={() => handleBookmarkToggle(card.id)}
                        onDelete={() => handleDeleteSelfStudy(card.id)}
                        favoritesLabel={
                          bookmarkedIds.has(Number(card.id))
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                      />
                    }
                  />
                </div>
              ) : null
            )}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
