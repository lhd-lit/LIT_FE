import { QuoteBanner } from "../../features/home/components/QuoteBanner";
import { StudySection } from "../../features/home/components/StudySection";
import FocusingIcon from "../../shared/assets/focusingIcon.svg";
import BrainStormingIcon from "../../shared/assets/brainstormingIcon.svg";
import { CardMetaData } from "../../features/home/components/CardMetaData";
import { useFocusingBookmarks, useBrainstormingBookmarks } from "../../features/home/hooks/useBookmarks";
import { useRecentSelfStudy } from "../../features/home/hooks/useRecentSelfStudy";
import { useRecentGroup } from "../../features/home/hooks/useRecentGroup";

export default function HomePage() {
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

  return (
    <div className="flex flex-col gap-6">
      <QuoteBanner />

      <StudySection
        icon={FocusingIcon}
        title="Focusing"
        description="Individual AI-assisted study"
        actionLabel="Continue Focusing"
        recentCard={recentSelfStudyCard}
        recentLoading={recentSelfStudyLoading}
        recentError={recentSelfStudyError?.message ?? null}
        recentContinuePath={(card) => `/focusing/study/${card.id}`}
        bookmarkedCards={focusingBookmarks}
      />

      <StudySection
        icon={BrainStormingIcon}
        title="Brain Storming"
        description="Collaborative group-based learning"
        actionLabel="Join Discussion"
        recentCard={recentGroupCard}
        recentLoading={recentGroupLoading}
        recentError={recentGroupError?.message ?? null}
        recentContinuePath={(card) => `/brainstorming/group/${card.id}`}
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
