import { QuoteBanner } from "../../features/home/components/QuoteBanner";
import { StudySection } from "../../features/home/components/StudySection";
import FocusingIcon from "../../shared/assets/focusingIcon.svg";
import BrainStormingIcon from "../../shared/assets/brainstormingIcon.svg";
import { CardMetaData } from "../../features/home/components/CardMetaData";
import {
  MOCK_RECENT_CARD_OF_FOCUSING,
  MOCK_BOOKMARKED_CARDS_OF_FOCUSING,
  MOCK_RECENT_CARD,
  MOCK_BOOKMARKED_CARDS,
} from "../../mock/home/mockData";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <QuoteBanner />

      <StudySection
        icon={FocusingIcon}
        title="Focusing"
        description="Individual AI-assisted study"
        actionLabel="Continue Focusing"
        recentCard={MOCK_RECENT_CARD_OF_FOCUSING}
        bookmarkedCards={MOCK_BOOKMARKED_CARDS_OF_FOCUSING}
      />

      <StudySection
        icon={BrainStormingIcon}
        title="Brain Storming"
        description="Collaborative group-based learning"
        actionLabel="Join Discussion"
        recentCard={MOCK_RECENT_CARD}
        bookmarkedCards={MOCK_BOOKMARKED_CARDS}
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
