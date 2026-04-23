import { MOCK_DB } from '@/lib/db';
import { moderateContent } from '@/lib/moderation';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  await delay(700);
  return Response.json({ reels: MOCK_DB.reels });
}

export async function POST(req: Request) {
  const data = await req.json();
  const { title, author } = data;

  const moderation = await moderateContent(title);
  
  if (!moderation.isValid) {
    return Response.json({ 
      success: false, 
      error: moderation.reason, 
      score: moderation.score 
    }, { status: 400 });
  }

  const newReel = {
    id: MOCK_DB.reels.length + 1,
    title,
    author,
    color: '#B535F6',
    views: '0',
    skill: 'New Skill',
    likes: 0
  };

  MOCK_DB.reels.push(newReel);
  
  return Response.json({ 
    success: true, 
    reel: newReel, 
    moderationScore: moderation.score 
  });
}
