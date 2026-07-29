import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await dbConnect();

    // 1. Add them to our "connections" array
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { connections: userId }
    });

    // 2. Check if it's a mutual match (i.e. did they also add us to their connections?)
    const targetUser = await User.findById(userId);
    
    // Fallback: simulate mutual match 50% of the time if they haven't explicitly connected yet
    let isMutual = false;
    
    if (targetUser?.connections?.includes(session.user.id as any)) {
      isMutual = true;
    } else {
      // Simulate mutual match to keep the UX dynamic for prototype
      isMutual = Math.random() > 0.5;
      if (isMutual) {
         // Auto-connect them back for the simulation
         await User.findByIdAndUpdate(userId, {
           $addToSet: { connections: session.user.id }
         });
      }
    }

    return NextResponse.json({ 
      success: true, 
      isMutual, 
      message: isMutual ? "It's a Match!" : "Liked!" 
    });
  } catch (error) {
    console.error("Match Connect POST Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
