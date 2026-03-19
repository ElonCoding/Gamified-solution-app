export type Challenge = {
  id: string;
  type: "daily" | "weekly" | "monthly";
  title: string;
  subject: string;
  baseXp: number;
  difficulty: string;
  adaptiveDifficulty: string;
  timeLimitMin: number;
};

export type DashboardPayload = {
  user: {
    id: string;
    name: string;
    level: string;
    xp: number;
    coins: number;
    streak: number;
    badges: string[];
  };
  progress: {
    nextLevel: string;
    remainingXp: number;
    proficiency: {
      tech: number;
      aptitude: number;
      softSkills: number;
    };
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
};

