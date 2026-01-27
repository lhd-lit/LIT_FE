export type Card = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
};

export type FocusingCard = Card;

export type BrainStormingCard = Card & {
  members: number;
  comments: number;
};