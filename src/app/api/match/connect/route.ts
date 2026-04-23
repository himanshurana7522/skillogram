import { MOCK_DB } from '@/lib/db';

export async function POST(request: Request) {
  const { userId } = await request.json();
  
  if (!MOCK_DB.connections.includes(userId)) {
    MOCK_DB.connections.push(userId);
  }

  // Check if it's a mutual match (Simulated: Elena and David always match back)
  const isMutual = userId === '1' || userId === '4';

  return Response.json({ 
    success: true, 
    isMutual, 
    message: isMutual ? "It's a Match!" : "Liked!" 
  });
}
