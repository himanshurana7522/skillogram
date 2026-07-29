import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
  await dbConnect();
  
  // For the sake of the MVP, we just return all users except the current one (if we had the session). 
  // Let's just return 10 random users to simulate connections.
  const connections = await User.find({}).limit(10);
  
  return Response.json({ connections });
}
