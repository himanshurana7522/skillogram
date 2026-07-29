import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Story from '@/models/Story';
import User from '@/models/User';

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch active stories (expiresAt > now) and populate the author details
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user_id',
        select: 'name username initials color avatarUrl',
        model: User
      })
      .limit(50);
    
    // Group stories by userId for the horizontal bar
    const grouped = stories.reduce((acc: any, story) => {
      const authorId = story.user_id?._id?.toString();
      if (!authorId) return acc;

      if (!acc[authorId]) {
        acc[authorId] = {
          userId: authorId,
          username: story.user_id?.name || 'Skiller',
          authorInitials: story.user_id?.initials || 'S',
          authorColor: story.user_id?.color || '#8B5CF6',
          authorAvatarUrl: story.user_id?.avatarUrl || null,
          stories: [],
        };
      }

      acc[authorId].stories.push({
        id: story._id.toString(),
        mediaUrl: story.media_url,
        createdAt: story.createdAt
      });

      return acc;
    }, {});

    return NextResponse.json({ storyGroups: Object.values(grouped) });
  } catch (error) {
    console.error("Fetch stories error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
