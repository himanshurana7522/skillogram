import { MOCK_DB } from '@/lib/db';

export async function GET() {
  const connectedIds = MOCK_DB.connections;
  
  // Map connected IDs to full user objects from the pool
  const connections = connectedIds.map(id => {
    return MOCK_DB.userPool.find(u => u.id === id);
  }).filter(Boolean);

  return Response.json({ connections });
}
