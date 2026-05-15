import { useState, useMemo } from "react";
import { PageLayout } from "../../shared/components/PageLayout";
import brainstormingIcon from "../../shared/assets/brainstormingIcon.svg";
import { CreateGroupButton } from "../../features/brainstorming/components/CreateGroupButton";
import { CreateGroupModal } from "../../features/brainstorming/components/CreateGroupModal";
import { GroupCard } from "../../features/brainstorming/components/GroupCard";
import { useGroupsList } from "../../features/brainstorming/hooks/useGroupsList";
import { useGroupBookmarks } from "../../features/brainstorming/hooks/useGroupBookmarks";
import type { StudyGroup } from "../../features/brainstorming/types";

const CARD_GRID =
  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6";

export default function BrainStormingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, loading, error, refetch } = useGroupsList();
  const {
    bookmarkedGroupIds,
    toggle: toggleBookmark,
    isToggling: isBookmarkToggling,
  } = useGroupBookmarks();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const filteredGroups = useMemo(() => {
    // null이나 undefined 항목을 먼저 필터링
    const validGroups = (groups || []).filter((group) => group != null && group.id != null);
    
    if (validGroups.length === 0) return [];
    if (!searchQuery.trim()) return validGroups;
    
    const query = searchQuery.toLowerCase();
    return validGroups.filter(
      (group) =>
        group &&
        group.id &&
        (group.title?.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query))
    );
  }, [groups, searchQuery]);

  const { favoriteGroups, otherGroups } = useMemo(() => {
    const fav: StudyGroup[] = [];
    const rest: StudyGroup[] = [];
    for (const g of filteredGroups) {
      if (!g?.id) continue;
      if (bookmarkedGroupIds.has(g.id)) fav.push(g);
      else rest.push(g);
    }
    return { favoriteGroups: fav, otherGroups: rest };
  }, [filteredGroups, bookmarkedGroupIds]);

  return (
    <>
      <PageLayout
        title="Brain Storming"
        description="Collaborate with classmates on literary works"
        icon={brainstormingIcon}
        iconAlt="brainstorming"
        searchPlaceholder="Search study groups..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={<CreateGroupButton onClick={handleOpenModal} />}
      >
        <section className="bg-background p-4 sm:p-6 flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-sm font-inter">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-sm font-inter text-red-600">{error}</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-sm font-inter">
                {searchQuery ? "검색 결과가 없습니다." : "스터디 그룹이 없습니다."}
              </p>
            </div>
          ) : favoriteGroups.length > 0 ? (
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className={CARD_GRID}>
                {favoriteGroups.map((group) =>
                  group?.id ? (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onLeaveSuccess={refetch}
                      isFavorite={bookmarkedGroupIds.has(group.id)}
                      onToggleFavorite={() => void toggleBookmark(group.id)}
                      favoriteDisabled={isBookmarkToggling(group.id)}
                    />
                  ) : null
                )}
              </div>
              {otherGroups.length > 0 && (
                <div className={CARD_GRID}>
                  {otherGroups.map((group) =>
                    group?.id ? (
                      <GroupCard
                        key={group.id}
                        group={group}
                        onLeaveSuccess={refetch}
                        isFavorite={bookmarkedGroupIds.has(group.id)}
                        onToggleFavorite={() => void toggleBookmark(group.id)}
                        favoriteDisabled={isBookmarkToggling(group.id)}
                      />
                    ) : null
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={CARD_GRID}>
              {filteredGroups.map((group) =>
                group?.id ? (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onLeaveSuccess={refetch}
                    isFavorite={bookmarkedGroupIds.has(group.id)}
                    onToggleFavorite={() => void toggleBookmark(group.id)}
                    favoriteDisabled={isBookmarkToggling(group.id)}
                  />
                ) : null
              )}
            </div>
          )}
        </section>
      </PageLayout>

      {isModalOpen && <CreateGroupModal open={isModalOpen} onClose={handleCloseModal} />}
    </>
  );
}
