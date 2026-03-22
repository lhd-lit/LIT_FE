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

export type GroupWork = {
  id: string;
  title: string;
  author?: string;
  description?: string;
  pdfPath?: string;
  members?: number;
  comments?: number;
  isPinned?: boolean;
};

/** 그룹 문서 댓글 사이드바(DocumentComment API ↔ UI) */
export type GroupChatComment = {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  replies?: GroupChatComment[];
};


