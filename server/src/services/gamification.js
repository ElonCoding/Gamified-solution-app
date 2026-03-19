const LEVELS = [
  { name: "Beginner", minXp: 0 },
  { name: "Intermediate", minXp: 500 },
  { name: "Advanced", minXp: 1200 },
  { name: "Master", minXp: 2200 }
];

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

const adaptiveDifficulty = (accuracy) => {
  if (accuracy >= 85) return "hard";
  if (accuracy >= 65) return "medium";
  return "easy";
};

const awardBadges = (user) => {
  const updates = new Set(user.badges);
  if (user.streak >= 7) updates.add("Consistency King");
  if (user.weeklyStats.accuracy >= 90) updates.add("Top Performer");
  if (user.completedChallenges.length >= 20) updates.add("Mission Machine");
  return [...updates];
};

module.exports = { levelFromXp, nextLevel, adaptiveDifficulty, awardBadges, LEVELS };

