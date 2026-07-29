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
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map mongoose document to frontend expected format
    const profile = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      teachingSkills: user.teachingSkills,
      learningSkills: user.learningSkills,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      connectionsCount: user.connections?.length || 0,
      avatarUrl: user.avatarUrl,
      initials: user.initials,
      color: user.color,
      isPrivate: user.isPrivate,
      accountType: user.accountType
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    await dbConnect();

    // Prevent restricted fields from being updated directly
    delete updates.password;
    delete updates.email;
    delete updates._id;

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      teachingSkills: user.teachingSkills,
      learningSkills: user.learningSkills,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      connectionsCount: user.connections?.length || 0,
      avatarUrl: user.avatarUrl,
      initials: user.initials,
      color: user.color,
      isPrivate: user.isPrivate,
      accountType: user.accountType
    };

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile PATCH Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
