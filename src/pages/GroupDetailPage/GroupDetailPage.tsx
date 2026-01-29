import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/components/PageLayout";
import { StudyCard } from "../../shared/components/StudyCard";
import { CardMetaData } from "../../features/home/components/CardMetaData";
import { MOCK_STUDY_GROUPS } from "../../mock/brainstorming/mockData";
import { MOCK_GROUP_WORKS } from "../../mock/brainstorming/groupWorksMockData";
import brainstormingIcon from "../../shared/assets/brainstormingIcon.svg";
import pinnedIcon from "../../shared/assets/pinnedIcon.svg";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const group = MOCK_STUDY_GROUPS.find((g) => g.id === groupId);
  const works = groupId ? MOCK_GROUP_WORKS[groupId] || [] : [];

  const handleWorkClick = (workId: string) => {
    navigate(`/brainstorming/group/${groupId}/work/${workId}`);
  };

  const filteredWorks = works.filter(
    (work) =>
      !searchQuery ||
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedWorks = filteredWorks.filter((work) => work.isPinned);
  const allWorks = filteredWorks.filter((work) => !work.isPinned);

  if (!group) {
    return (
      <div className="p-8">
        <p>Group not found</p>
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
      >

        <section className="bg-background shadow-sm p-4 sm:p-6 flex flex-col gap-6">
          {pinnedWorks.length > 0 && (
            <div>
              <h2 className="heading-primary text-base mb-4">Pinned Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {pinnedWorks.map((work) => (
                  <div key={work.id} className="relative cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                    <StudyCard card={work} variant="grid">
                      <CardMetaData members={work.members} comments={work.comments} />
                    </StudyCard>
                    <div className="absolute top-4 right-4">
                      <img src={pinnedIcon} alt="pinned" className="w-10 h-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="heading-primary text-base mb-4">All Works</h2>
            {allWorks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {allWorks.map((work) => (
                  <div key={work.id} className="cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                    <StudyCard card={work} variant="grid">
                      <CardMetaData members={work.members} comments={work.comments} />
                    </StudyCard>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-inter text-text-secondary">No works found</p>
            )}
          </div>
        </section>
      </PageLayout>
  );
}

