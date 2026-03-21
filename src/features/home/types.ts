export type Card = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  /** ISO date from API (e.g. last viewed) */
  lastViewedAt?: string | null;
};

export type FocusingCard = Card;

export type BrainStormingCard = Card & {
  members: number;
  comments: number;
};