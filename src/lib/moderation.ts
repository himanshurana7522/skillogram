/**
 * Simulated AI Moderation Engine
 * In a production environment, this would call an OpenAI/Vertex AI endpoint.
 */

const EDUCATIONAL_KEYWORDS = [
  'how to', 'tutorial', 'learn', 'guide', 'mastery', 'coding', 'design', 'figma', 
  'react', 'nextjs', 'skill', 'education', 'workshop', 'lesson', 'basics'
];

const SPAM_KEYWORDS = [
  'win money', 'crypto moon', 'free giveaway', 'click here', 'exclusive deal'
];

export type ModerationResult = {
  isValid: boolean;
  score: number;
  reason: string | null;
};

export async function moderateContent(text: string): Promise<ModerationResult> {
  const lowercaseText = text.toLowerCase();
  
  // 1. Spam check
  const hasSpam = SPAM_KEYWORDS.some(k => lowercaseText.includes(k));
  if (hasSpam) {
    return { isValid: false, score: 0, reason: 'Content flagged as spam or non-educational advertisement.' };
  }

  // 2. Educational check (Keyword density check)
  const matches = EDUCATIONAL_KEYWORDS.filter(k => lowercaseText.includes(k));
  const score = (matches.length / 3) * 100; // Simplified scoring: 3 keywords = 100%

  if (score < 20) {
    return { isValid: false, score, reason: 'Content does not appear to be educational or skill-oriented.' };
  }

  return { isValid: true, score: Math.min(score, 100), reason: null };
}
