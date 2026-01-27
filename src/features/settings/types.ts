export type UserProfile = {
  name: string;
  email: string;
  initials: string;
};

export type UsageStats = {
  used: number;
  total: number;
  labelUsed: string;
  labelRemaining: string;
  description: string;
};

export type StorageStats = {
  used: number;
  total: number;
  unit: "GB" | "MB";
  description: string;
};
