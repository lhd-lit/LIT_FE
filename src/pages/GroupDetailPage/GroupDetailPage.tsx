import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { StudyCard } from "../../shared/components/StudyCard";
import { GroupWorkCardMenu } from "../../features/brainstorming/components/GroupWorkCardMenu";
import { CardMetaData } from "../../features/home/components/CardMetaData";
import brainstormingIcon from "../../shared/assets/brainstormingIcon.svg";
import pinnedIcon from "../../shared/assets/pinnedIcon.svg";
import { useStudyGroup } from "../../features/brainstorming/hooks/useStudyGroup";
import { useAddGroupDocument } from "../../features/brainstorming/hooks/useAddGroupDocument";
import { deleteGroupDocument } from "../../features/brainstorming/api/groups.api";
import {
  isGroupDocumentBookmarked,
  toggleGroupDocumentBookmark,
} from "../../features/brainstorming/utils/groupDocumentBookmarks";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import type { GroupWork } from "../../features/brainstorming/types";
import type { Card } from "../../features/home/types";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setBookmarkTick] = useState(0);
  const navigate = useNavigate();
  const { group, works, loading, error, refetch } = useStudyGroup(groupId);
  const { handleAddDocument, loading: uploadLoading, error: uploadError } = useAddGroupDocument(
    groupId,
    refetch
  );

  const handleUploadSubmit = async (payload: {
    title: string;
    description: string;
    file: File | null;
  }) => {
    try {
      await handleAddDocument({
        title: payload.title,
        description: payload.description,
        file: payload.file,
      });
    } catch (err) {
      // 에러는 useAddGroupDocument에서 처리됨
    }
  };

  const handleWorkClick = (workId: string) => {
    navigate(`/brainstorming/group/${groupId}/work/${workId}`);
  };

  const handleDeleteWork = async (workId: string) => {
    if (!groupId) return;
    try {
      await deleteGroupDocument(groupId, workId);
      refetch();
    } catch (e) {
      alert(getApiErrorMessage(e, "작품 삭제에 실패했습니다."));
    }
  };

  const handleToggleWorkBookmark = (workId: string) => {
    if (!groupId) return;
    toggleGroupDocumentBookmark(groupId, workId);
    setBookmarkTick((t) => t + 1);
  };

  const workIsBookmarked = (workId: string) =>
    groupId ? isGroupDocumentBookmarked(groupId, workId) : false;

  const filteredWorks = useMemo(() => {
    if (!works || works.length === 0) return [];
    if (!searchQuery.trim()) {
      return works.filter((work) => work && work.id);
    }
    const query = searchQuery.toLowerCase();
    return works.filter(
      (work) =>
        work &&
        work.id &&
        (work.title?.toLowerCase().includes(query) ||
          work.author?.toLowerCase().includes(query))
    );
  }, [works, searchQuery]);

  const { pinned, unpinned } = useMemo(() => {
    return {
      pinned: filteredWorks.filter((work) => work.isPinned),
      unpinned: filteredWorks.filter((work) => !work.isPinned),
    };
  }, [filteredWorks]);

  // GroupWork를 Card 타입으로 변환
  const convertWorkToCard = (work: GroupWork): Card => {
    if (!work || !work.id) {
      throw new Error('Invalid work object');
    }
    return {
      id: work.id,
      title: work.title || '',
      author: work.author || 'Unknown',
      thumbnail: work.pdfPath || '/default-thumbnail.png', // 기본 썸네일 또는 pdfPath 사용
    };
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-center text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="p-8">
        <p className="text-center text-red-600">{error || "Group not found"}</p>
      </div>
    );
  }

  return (
      <PageLayout
        title={group.title}
        description=""
        icon={brainstormingIcon}
        iconAlt="group"
        searchPlaceholder="Search by study groups..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        enableUpload={true}
        uploadModalHeading="Upload Study"
        uploadModalSubheading="Add a new document, PDF, or article to this study group"
        onUploadSubmit={handleUploadSubmit}
      >
        <section className="bg-background shadow-sm p-4 sm:p-6 flex flex-col gap-6">
        {pinned.length > 0 && (
            <div>
              <h2 className="heading-primary text-base mb-4">Pinned Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {pinned.map((work) => 
                work && work.id ? (
                  <div key={work.id} className="relative cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                    <StudyCard
                      card={convertWorkToCard(work)}
                      variant="grid"
                      isFavorite={workIsBookmarked(work.id)}
                      gridMenu={
                        <GroupWorkCardMenu
                          isFavorite={workIsBookmarked(work.id)}
                          onToggleFavorite={() => handleToggleWorkBookmark(work.id)}
                          onDelete={() => void handleDeleteWork(work.id)}
                        />
                      }
                    >
                      <CardMetaData 
                        members={work.members || 0} 
                        comments={work.comments || 0} 
                      />
                    </StudyCard>
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <img src={pinnedIcon} alt="pinned" className="w-10 h-10" />
                    </div>
                  </div>
                ) : null
              )}
              </div>
            </div>
          )}

          <div>
            <h2 className="heading-primary text-base mb-4">All Works</h2>
          {unpinned.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {unpinned.map((work) => 
                work && work.id ? (
                  <div key={work.id} className="cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                    <StudyCard
                      card={convertWorkToCard(work)}
                      variant="grid"
                      isFavorite={workIsBookmarked(work.id)}
                      gridMenu={
                        <GroupWorkCardMenu
                          isFavorite={workIsBookmarked(work.id)}
                          onToggleFavorite={() => handleToggleWorkBookmark(work.id)}
                          onDelete={() => void handleDeleteWork(work.id)}
                        />
                      }
                    >
                      <CardMetaData 
                        members={work.members || 0} 
                        comments={work.comments || 0} 
                      />
                    </StudyCard>
                  </div>
                ) : null
              )}
              </div>
            ) : (
              <p className="text-sm font-inter text-text-secondary">No works found</p>
            )}
          </div>
        </section>
      </PageLayout>
  );
}

