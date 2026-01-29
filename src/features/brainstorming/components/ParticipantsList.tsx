type Participant = {
  id: string;
  name: string;
  initials: string;
  isActive?: boolean;
};

type ParticipantsListProps = {
  participants: Participant[];
  activeCount?: number;
};

export function ParticipantsList({ participants, activeCount }: ParticipantsListProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm font-inter text-text-primary">Participants:</span>
      <div className="flex items-center gap-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="w-8 h-8 rounded-full bg-primary text-white text-xs font-inter flex items-center justify-center -ml-2"
            title={participant.name}
          >
            {participant.initials}
          </div>
        ))}
      </div>
      {activeCount !== undefined && activeCount > 0 && (
        <button className="px-3 py-1 rounded-lg bg-background-light text-text-secondary text-xs font-inter hover:bg-background-hover transition">
          {activeCount} Active now
        </button>
      )}
    </div>
  );
}

