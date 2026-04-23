import { MOCK_DB } from '@/lib/db';

export async function GET() {
  const currentUser = MOCK_DB.profile;
  const following = MOCK_DB.connections;
  
  // Suggest users who teach what I want to learn, but aren't followed yet
  const suggested = MOCK_DB.userPool.filter(user => 
    !following.includes(user.id) && 
    user.id !== currentUser.id &&
    user.teachingSkills.some(s => currentUser.learningSkills.includes(s))
  );

  return Response.json({ suggested });
}

export async function POST(request: Request) {
  const { userId, action } = await request.json();
  
  if (action === 'follow') {
    if (!MOCK_DB.connections.includes(userId)) {
      MOCK_DB.connections.push(userId);
    }
  } else if (action === 'unfollow') {
    MOCK_DB.connections = MOCK_DB.connections.filter(id => id !== userId);
  }

  return Response.json({ success: true, isFollowing: action === 'follow' });
}
