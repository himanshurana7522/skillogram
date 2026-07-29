import dbConnect from '@/lib/mongoose';
import Reel from '@/models/Reel';

export async function GET() {
  await dbConnect();
  const reels = await Reel.find({}).sort({ createdAt: -1 }).limit(20);
  return Response.json({ reels });
}

export async function POST(req: Request) {
  const data = await req.json();
  const { title, author } = data;

  await dbConnect();
  
  const newReel = await Reel.create({
    title,
    author,
    color: '#B535F6',
    views: '0',
    skill: 'New Skill',
    likes: 0
  });
  
  return Response.json({ 
    success: true, 
    reel: newReel
  });
}
