import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await dbConnect();
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isBookmarked = user.bookmarks && user.bookmarks.includes(postId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id: any) => id.toString() !== postId);
    } else {
      if (!user.bookmarks) user.bookmarks = [];
      user.bookmarks.push(postId);
    }

    await user.save();

    return NextResponse.json({ bookmarked: !isBookmarked });
  } catch (error) {
    console.error('Bookmark Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
