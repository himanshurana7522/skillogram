import { MOCK_DB } from '@/lib/db';
import { rankExploreGrid } from '@/lib/algorithm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (q) {
    // Search history tracking for algorithm tuning
    MOCK_DB.activity.searchHistory.unshift(q);
    
    // Search logic
    const users = MOCK_DB.userPool.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) ||
      u.teachingSkills.some(s => s.toLowerCase().includes(q))
    );
    const rooms = MOCK_DB.rooms.filter(r => 
      r.topic.toLowerCase().includes(q) || 
      r.host.toLowerCase().includes(q)
    );
    return Response.json({ users, rooms });
  }

  // DEFAULT: Explore Feed (Phase 16: Personalized)
  const initialExplore = [
    { id: 'ex1', type: 'reel', content: '#B535F6', span: 'v-large', category: 'design' }, 
    { id: 'ex2', type: 'image', content: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159', span: 'normal', category: 'coding' },
    { id: 'ex3', type: 'image', content: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713', span: 'normal', category: 'coding' },
    { id: 'ex4', type: 'video', content: '#2D8CFF', span: 'normal', category: 'design' },
    { id: 'ex5', type: 'image', content: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', span: 'normal', category: 'hardware' },
    { id: 'ex6', type: 'reel', content: '#FF3366', span: 'normal', category: 'marketing' },
    { id: 'ex7', type: 'image', content: '#00D1FF', span: 'h-large', category: 'design' },
    { id: 'ex8', type: 'image', content: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', span: 'normal', category: 'coding' },
  ];

  const rankedExplore = rankExploreGrid(MOCK_DB.profile, initialExplore);
  const trending = ['React', 'Figma', 'Next.js', 'AWS', 'UI/UX', 'Python', 'Web3'];

  return Response.json({ exploreItems: rankedExplore, trending });
}

export async function POST(request: Request) {
  const { action, query } = await request.json();
  if (action === 'search') {
    MOCK_DB.activity.searchHistory.unshift(query);
  } else if (action === 'tune') {
    return Response.json({ success: true, message: 'Algorithm weight updated.' });
  }
  return Response.json({ success: true });
}
