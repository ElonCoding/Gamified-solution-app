export type Challenge = {
  id: string;
  type: "daily" | "weekly" | "monthly";
  title: string;
  subject: string;
  description?: string;
  baseXp: number;
  difficulty: string;
  adaptiveDifficulty: string;
  timeLimitMin: number;
  completed?: boolean;
};

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  level: string;
  xp: number;
  coins: number;
  streak: number;
  badges: string[];
  joinedAt?: string;
  totalChallengesCompleted?: number;
};

export type DashboardPayload = {
  user: UserInfo;
  progress: {
    nextLevel: string;
    remainingXp: number;
    levelProgress: number;
    proficiency: { tech: number; aptitude: number; softSkills: number };
    streakMultiplier: number;
    streakActive: boolean;
  };
  activeChallenges: Challenge[];
};

export type LeaderboardItem = {
  rank: number;
  id: string;
  name: string;
  xp: number;
  streak: number;
  level: string;
  badges?: string[];
};

export type AnalyticsPayload = {
  weeklyGrowth: { week: string; xp: number }[];
  metrics: { accuracy: number; speed: number; consistency: number };
  proficiency: { tech: number; aptitude: number; softSkills: number };
  improvementRate: number;
  feedback: string;
};

export type SkillNode = {
  id: string;
  name: string;
  requiredXp: number;
  unlocked: boolean;
  progress: number;
};

export type SkillBranch = {
  name: string;
  icon: string;
  nodes: SkillNode[];
};

export type SkillTree = {
  tech: SkillBranch;
  aptitude: SkillBranch;
  softSkills: SkillBranch;
};

export type ProfilePayload = {
  user: UserInfo;
  allBadges: { id: string; name: string; icon: string; description: string }[];
  levelInfo: {
    current: { name: string; minXp: number; icon: string };
    next: { name: string; minXp: number; icon: string };
    progress: number;
  };
  proficiency: { tech: number; aptitude: number; softSkills: number };
  weeklyStats: { accuracy: number; speed: number; consistency: number };
};

export type AdminStats = {
  totalUsers: number;
  totalChallenges: number;
  totalSubmissions: number;
  avgXp: number;
  activeStreaks: number;
  levelDistribution: Record<string, number>;
  topPerformers: { name: string; xp: number; level: string; streak: number }[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  level: string;
  badges: string[];
  joinedAt?: string;
};

export type AdminSubmission = {
  id: string;
  userId: string;
  userName: string;
  challengeId: string;
  challengeTitle: string;
  accuracy: number;
  timeSpentMin: number;
  earnedXp: number;
  earnedCoins: number;
  submittedAt: string;
};
