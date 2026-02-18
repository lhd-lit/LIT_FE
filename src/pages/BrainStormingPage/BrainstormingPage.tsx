import { useState } from "react";
import { PageLayout } from "../../shared/components/PageLayout";
import brainstormingIcon from "../../shared/assets/brainstormingIcon.svg";
import { CreateGroupButton } from "../../features/brainstorming/components/CreateGroupButton";
import { CreateGroupModal } from "../../features/brainstorming/components/CreateGroupModal";
import { GroupCard } from "../../features/brainstorming/components/GroupCard";

export default function BrainStormingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <PageLayout
        title="Brain Storming"
        description="Collaborate with classmates on literary works"
        icon={brainstormingIcon}
        iconAlt="brainstorming"
        searchPlaceholder="Search study groups..."
        actions={<CreateGroupButton onClick={handleOpenModal} />}
      >
        <section className="bg-background p-4 sm:p-6 flex flex-col gap-4">
          {/* TODO: API 연동으로 그룹 목록 가져오기 */}
          <div className="text-center py-12 text-text-secondary">
            <p className="text-sm font-inter">No study groups found</p>
          </div>
        </section>
      </PageLayout>

      <CreateGroupModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
