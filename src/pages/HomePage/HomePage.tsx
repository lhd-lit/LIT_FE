import { useNavigate } from "react-router-dom";
import { QuoteBanner } from "../../features/home/components/QuoteBanner";
import { StudySection } from "../../features/home/components/StudySection";
import FocusingIcon from "../../shared/assets/focusingIcon.svg";
import BrainStormingIcon from "../../shared/assets/brainstormingIcon.svg";
import { CardMetaData } from "../../features/home/components/CardMetaData";
import { useFocusingBookmarks, useBrainstormingBookmarks } from "../../features/home/hooks/useBookmarks";
import { useRecentSelfStudy } from "../../features/home/hooks/useRecentSelfStudy";
import { useRecentGroup } from "../../features/home/hooks/useRecentGroup";
import { getGroupDocuments } from "../../features/brainstorming/api/groups.api";
import type { Card } from "../../features/home/types";

export default function HomePage() {
  const navigate = useNavigate();
  const { cards: focusingBookmarks } = useFocusingBookmarks();
  const { cards: brainstormingBookmarks } = useBrainstormingBookmarks();
  const {
    card: recentSelfStudyCard,
    loading: recentSelfStudyLoading,
    error: recentSelfStudyError,
  } = useRecentSelfStudy();
  const {
    card: recentGroupCard,
    loading: recentGroupLoading,
    error: recentGroupError,
  } = useRecentGroup();

  /** 그룹 문서 목록 조회 후 첫 문서의 학습·채팅 화면으로 이동 (문서 없으면 그룹 상세) */
  const handleBrainstormingJoinDiscussion = async (card: Card) => {
    const groupId = card.id;
    try {
      const res = await getGroupDocuments(groupId, 0, 100);
      const first = res.content?.find((d) => d != null && d.groupDocumentId != null);
      if (first) {
        navigate(`/brainstorming/group/${groupId}/work/${first.groupDocumentId}`);
      } else {
        navigate(`/brainstorming/group/${groupId}`);
      }
    } catch {
      navigate(`/brainstorming/group/${groupId}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <QuoteBanner />

      <StudySection
        icon={FocusingIcon}
        title="Focusing"
        description="Individual AI-assisted study"
        viewAllTo="/focusing"
        actionLabel="Continue Focusing"
        recentCard={recentSelfStudyCard}
        recentLoading={recentSelfStudyLoading}
        recentError={recentSelfStudyError?.message ?? null}
        recentContinuePath={(card) => `/focusing/study/${card.id}`}
        bookmarkedCards={focusingBookmarks}
        onBookmarkedCardClick={(card) => navigate(`/focusing/study/${card.id}`)}
      />

      <StudySection
        icon={BrainStormingIcon}
        title="Brain Storming"
        description="Collaborative group-based learning"
        viewAllTo="/brainstorming"
        actionLabel="Join Discussion"
        recentCard={recentGroupCard}
        recentLoading={recentGroupLoading}
        recentError={recentGroupError?.message ?? null}
        onRecentContinue={handleBrainstormingJoinDiscussion}
        bookmarkedCards={brainstormingBookmarks}
        renderRecentMetaData={(card) => (
          <CardMetaData members={card.members || 0} comments={card.comments || 0} />
        )}
        renderBookmarkedMetaData={(card) => (
          <CardMetaData members={card.members || 0} comments={card.comments || 0} />
        )}
      />
    </div>
  );
} 
