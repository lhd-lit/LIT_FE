import { QuoteBanner } from "../../features/home/components/QuoteBanner";
import { StudySection } from "../../features/home/components/StudySection";
import FocusingIcon from "../../shared/assets/focusingIcon.svg";
import BrainStormingIcon from "../../shared/assets/brainstormingIcon.svg";
import { CardMetaData } from "../../features/home/components/CardMetaData";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <QuoteBanner />

      {/* TODO: API 연동으로 데이터 가져오기 */}
      <StudySection
        icon={FocusingIcon}
        title="Focusing"
        description="Individual AI-assisted study"
        actionLabel="Continue Focusing"
        recentCard={null}
        bookmarkedCards={[]}
      />

      <StudySection
        icon={BrainStormingIcon}
        title="Brain Storming"
        description="Collaborative group-based learning"
        actionLabel="Join Discussion"
        recentCard={null}
        bookmarkedCards={[]}
        renderRecentMetaData={(card) => (
          <CardMetaData members={card.members} comments={card.comments} />
        )}
        renderBookmarkedMetaData={(card) => (
          <CardMetaData members={card.members} comments={card.comments} />
        )}
      />
    </div>
  );
} 
