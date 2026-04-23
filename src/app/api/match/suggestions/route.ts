import { MOCK_DB } from '@/lib/db';
import { rankMatchSuggestions } from '@/lib/algorithm';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  await delay(800); 

  const currentUser = MOCK_DB.profile;
  const pool = MOCK_DB.userPool;

  const results = rankMatchSuggestions(currentUser, pool);
  
  // Return the users but include the AI score data
  const suggestions = results.map(r => ({
    ...r.user,
    aiScore: r.score,
    aiReason: r.reason
  }));

  return Response.json({ suggestions });
}
