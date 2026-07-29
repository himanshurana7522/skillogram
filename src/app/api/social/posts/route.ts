import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch posts and populate the author details
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'user_id',
        select: 'name username initials color avatarUrl',
        model: User
      })
      .limit(30);
    
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      userId: post.user_id?._id?.toString(),
      authorName: post.user_id?.name || 'Skiller',
      authorInitials: post.user_id?.initials || 'S',
      authorColor: post.user_id?.color || '#8B5CF6',
      authorAvatarUrl: post.user_id?.avatarUrl || null,
      mediaUrls: post.media_urls || [],
      type: post.type || 'image',
      caption: post.caption || '',
      hashtags: post.hashtags || [],
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      createdAt: new Date(post.createdAt).toLocaleDateString()
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const newPost = await Post.create({
      user_id: session.user.id,
      media_urls: body.media_urls || [],
      type: body.type || 'image',
      caption: body.caption || '',
      hashtags: body.hashtags || []
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
