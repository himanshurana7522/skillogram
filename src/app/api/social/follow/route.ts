import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findById(session.user.id);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Suggest users who teach what I want to learn, but aren't followed yet
    const followingIds = currentUser.following || [];
    
    const suggested = await User.find({
      _id: { $nin: [...followingIds, currentUser._id] },
      teachingSkills: { $in: currentUser.learningSkills }
    })
    .limit(10)
    .select('name username avatarUrl initials teachingSkills color');

    // Map to frontend expected format
    const formattedSuggested = suggested.map(user => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      initials: user.initials,
      teachingSkills: user.teachingSkills,
      color: user.color
    }));

    return NextResponse.json({ suggested: formattedSuggested });
  } catch (error) {
    console.error("Suggested Users GET Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, action } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await dbConnect();

    if (action === 'follow') {
      // Add target user to my following
      await User.findByIdAndUpdate(session.user.id, {
        $addToSet: { following: userId } // $addToSet prevents duplicates
      });
      // Add me to target user's followers
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: session.user.id }
      });
    } else if (action === 'unfollow') {
      // Remove target user from my following
      await User.findByIdAndUpdate(session.user.id, {
        $pull: { following: userId }
      });
      // Remove me from target user's followers
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: session.user.id }
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, isFollowing: action === 'follow' });
  } catch (error) {
    console.error("Follow POST Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
