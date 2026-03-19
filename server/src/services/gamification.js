const LEVELS = [
  { name: "Beginner", minXp: 0, icon: "🌱" },
  { name: "Intermediate", minXp: 500, icon: "⚡" },
  { name: "Advanced", minXp: 1200, icon: "🔥" },
  { name: "Master", minXp: 2200, icon: "👑" }
];

const ALL_BADGES = [
  { id: "fast_learner", name: "Fast Learner", icon: "⚡", description: "Complete 3 challenges" },
  { id: "consistency_king", name: "Consistency King", icon: "👑", description: "Maintain a 7-day streak" },
  { id: "top_performer", name: "Top Performer", icon: "🏆", description: "Achieve 90%+ accuracy" },
  { id: "streak_master", name: "Streak Master", icon: "🔥", description: "Maintain a 30-day streak" },
  { id: "mission_machine", name: "Mission Machine", icon: "🚀", description: "Complete 20+ challenges" },
  { id: "challenge_crusher", name: "Challenge Crusher", icon: "💪", description: "Complete 40+ challenges" },
  { id: "night_owl", name: "Night Owl", icon: "🦉", description: "Complete a challenge after midnight" },
  { id: "speed_demon", name: "Speed Demon", icon: "💨", description: "Finish a challenge in under 50% time" },
  { id: "perfectionist", name: "Perfectionist", icon: "✨", description: "Score 100% accuracy on any challenge" },
  { id: "well_rounded", name: "Well Rounded", icon: "🎯", description: "Reach 50%+ in all proficiency areas" }
];

const SKILL_TREE = {
  tech: {
    name: "Technology",
    icon: "💻",
    nodes: [
      { id: "t1", name: "Basics", requiredXp: 0, unlocked: true },
      { id: "t2", name: "Data Structures", requiredXp: 200 },
      { id: "t3", name: "Algorithms", requiredXp: 500 },
      { id: "t4", name: "System Design", requiredXp: 1000 },
      { id: "t5", name: "Advanced Architecture", requiredXp: 1800 }
    ]
  },
  aptitude: {
    name: "Aptitude",
    icon: "🧠",
    nodes: [
      { id: "a1", name: "Number Sense", requiredXp: 0, unlocked: true },
      { id: "a2", name: "Logical Reasoning", requiredXp: 150 },
      { id: "a3", name: "Data Interpretation", requiredXp: 400 },
      { id: "a4", name: "Advanced Quant", requiredXp: 800 },
      { id: "a5", name: "Case Analytics", requiredXp: 1500 }
    ]
  },
  softSkills: {
    name: "Soft Skills",
    icon: "🗣️",
    nodes: [
      { id: "s1", name: "Communication", requiredXp: 0, unlocked: true },
      { id: "s2", name: "Teamwork", requiredXp: 100 },
      { id: "s3", name: "Leadership", requiredXp: 350 },
      { id: "s4", name: "Negotiation", requiredXp: 700 },
      { id: "s5", name: "Executive Presence", requiredXp: 1400 }
    ]
  }
};

const levelFromXp = (xp) => {
  let current = LEVELS[0].name;
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level.name;
  }
  return current;
};

const nextLevel = (xp) => {
  const upcoming = LEVELS.find((l) => l.minXp > xp);
  return upcoming || LEVELS[LEVELS.length - 1];
};

const getLevelInfo = (xp) => {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  const next = LEVELS.find((l) => l.minXp > xp) || current;
  const progress = next === current ? 100 : Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100);
  return { current, next, progress };
};

const adaptiveDifficulty = (accuracy) => {
  if (accuracy >= 85) return "hard";
  if (accuracy >= 65) return "medium";
  return "easy";
};

const streakMultiplier = (streak) => {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
};

const checkStreak = (lastDate) => {
  if (!lastDate) return { active: false, shouldReset: true };
  const now = new Date();
  const last = new Date(lastDate);
  const diffHours = (now - last) / (1000 * 60 * 60);
  if (diffHours > 48) return { active: false, shouldReset: true };
  if (diffHours > 24) return { active: true, shouldReset: false };
  return { active: true, shouldReset: false };
};

const awardBadges = (user) => {
  const updates = new Set(user.badges || []);
  const total = user.totalChallengesCompleted || user.completedChallenges?.length || 0;
  if (total >= 3) updates.add("Fast Learner");
  if (user.streak >= 7) updates.add("Consistency King");
  if ((user.weeklyStats?.accuracy || 0) >= 90) updates.add("Top Performer");
  if (user.streak >= 30) updates.add("Streak Master");
  if (total >= 20) updates.add("Mission Machine");
  if (total >= 40) updates.add("Challenge Crusher");
  const prof = user.proficiency || {};
  if ((prof.tech || 0) >= 50 && (prof.aptitude || 0) >= 50 && (prof.softSkills || 0) >= 50) {
    updates.add("Well Rounded");
  }
  return [...updates];
};

const getSkillTree = (userXp) => {
  const tree = JSON.parse(JSON.stringify(SKILL_TREE));
  for (const branch of Object.values(tree)) {
    for (const node of branch.nodes) {
      node.unlocked = userXp >= node.requiredXp;
      node.progress = node.unlocked ? 100 : Math.min(99, Math.round((userXp / node.requiredXp) * 100));
    }
  }
  return tree;
};

module.exports = {
  LEVELS,
  ALL_BADGES,
  SKILL_TREE,
  levelFromXp,
  nextLevel,
  getLevelInfo,
  adaptiveDifficulty,
  streakMultiplier,
  checkStreak,
  awardBadges,
  getSkillTree
};
