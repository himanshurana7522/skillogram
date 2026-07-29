import { DbUser } from './db';

export type MatchResult = {
  user: DbUser;
  score: number;
  reason: string;
};

export function rankMatchSuggestions(viewer: DbUser, userPool: DbUser[]): MatchResult[] {
  return userPool
    .filter(u => u.id !== viewer.id)
    .map(candidate => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Core Complementary (Critical)
      const helpsMe = candidate.teachingSkills.filter(s => viewer.learningSkills.includes(s));
      if (helpsMe.length > 0) {
        score += 50 + (helpsMe.length * 5);
        reasons.push(`Teaches ${helpsMe[0]}`);
      }

      // 2. Mutual Swap (Gold Standard)
      const IHelpThem = viewer.teachingSkills.filter(s => candidate.learningSkills.includes(s));
      if (IHelpThem.length > 0) {
        score += 30 + (IHelpThem.length * 5);
        if (reasons.length === 0) reasons.push(`Wants to learn ${IHelpThem[0]}`);
        else reasons[0] = "Mutual Skill Swap";
      }

      // 3. Reputation & Experience
      score += (candidate.rating * 2);
      
      // 4. Random Discovery Factor (Prevent stagnation)
      score += Math.random() * 10;

      return { 
        user: candidate, 
        score: Math.min(Math.round(score), 100), 
        reason: reasons[0] || "Exploring new skills"
      };
    })
    .sort((a, b) => b.score - a.score);
}
