import { DbUser, MOCK_DB } from './db';

type RankedItem = {
  score: number;
  item: any;
};

export function rankContent(viewer: DbUser, contentList: any[], contentType: 'post' | 'reel' | 'explore'): any[] {
  const ranked = contentList.map(item => {
    let score = 0;
    
    // 1. Relationship Factor (Instagram: Following weight)
    const isFollowing = MOCK_DB.connections.includes(item.userId || item.authorId);
    if (isFollowing) score += 50;

    // 2. Skill Swap Relevance (SkillSwap specific intelligence)
    const author = MOCK_DB.userPool.find(u => u.id === (item.userId || item.authorId)) || MOCK_DB.profile;
    const skillOverlap = author.teachingSkills.some(s => viewer.learningSkills.includes(s));
    if (skillOverlap) score += 40;

    // 3. Global Popularity (Views/Likes)
    const hotness = parseInt(item.views || '0') / 1000 + (item.likes?.length || 0);
    score += hotness;

    // 4. Recency (Simplified)
    if (item.createdAt === 'Just now') score += 100;

    return { score, item };
  });

  return ranked.sort((a, b) => b.score - a.score).map(r => r.item);
}

export function rankExploreGrid(viewer: DbUser, exploreItems: any[]): any[] {
  // Personalized explore sorting based on search history and categories
  const searchHistory = MOCK_DB.activity.searchHistory.map(s => s.toLowerCase());
  
  return [...exploreItems].sort((a, b) => {
    const aMatch = searchHistory.some(s => a.category?.includes(s)) ? 1 : 0;
    const bMatch = searchHistory.some(s => b.category?.includes(s)) ? 1 : 0;
    return bMatch - aMatch;
  });
}

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
      let reasons: string[] = [];

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
