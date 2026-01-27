export type StudyGroup = {
  id: string;
  title: string;
  description: string;
  members: number;
  works: number;
  updatedAgo: string;
  owner: string;
  participants: string[];
  newCount?: number;
};

export type Member = {
  id: string;
  name: string;
  initials: string;
};

