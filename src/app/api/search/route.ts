import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Room from '@/models/Room';
import Post from '@/models/Post';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any); // Optional for search, but good for personalization

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';

    await dbConnect();

    if (q) {
      // Execute Text Search via RegExp
      const regex = new RegExp(q, 'i');
      
      const users = await User.find({
        $or: [
          { name: regex },
          { username: regex },
          { teachingSkills: regex }
        ]
      })
      .limit(10)
      .select('name username avatarUrl initials teachingSkills color');

      const formattedUsers = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        username: u.username,
        avatarUrl: u.avatarUrl,
        initials: u.initials,
        teachingSkills: u.teachingSkills,
        color: u.color
      }));

      const rooms = await Room.find({
        $or: [
          { topic: regex },
          { host: regex }
        ]
      })
      .limit(5);

      const formattedRooms = rooms.map(r => ({
        id: r._id.toString(),
        topic: r.topic,
        host: r.host,
        type: r.type,
        color: r.color,
        participantsCount: r.participantsCount
      }));

      return NextResponse.json({ users: formattedUsers, rooms: formattedRooms });
    }

    // DEFAULT: Explore Feed (Fetch real posts from DB)
    const topPosts = await Post.find({ type: 'image' }) // Prioritize images for the explore grid
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(15);
      
    // Transform them to fit the explore UI model
    const exploreItems = topPosts.map((post, index) => {
      // Make the 1st and 7th item span large for masonry look
      let span = 'normal';
      if (index === 0) span = 'v-large';
      if (index === 6) span = 'h-large';

      return {
        id: post._id.toString(),
        type: post.type,
        content: post.media_urls[0] || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
        span,
        category: post.hashtags[0] || 'trending'
      };
    });

    // If no posts exist yet, inject some fallbacks so the UI isn't broken
    if (exploreItems.length === 0) {
      exploreItems.push(
        { id: 'ex1', type: 'image', content: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159', span: 'v-large', category: 'design' },
        { id: 'ex2', type: 'image', content: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713', span: 'normal', category: 'coding' },
        { id: 'ex3', type: 'image', content: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', span: 'normal', category: 'hardware' }
      );
    }

    // Extract unique trending hashtags from top posts
    let trending = await Post.aggregate([
      { $unwind: "$hashtags" },
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    
    let trendingTags = trending.map(t => t._id);
    if (trendingTags.length === 0) {
      trendingTags = ['React', 'Figma', 'Next.js', 'AWS', 'UI/UX', 'Python', 'Web3'];
    }

    return NextResponse.json({ exploreItems, trending: trendingTags });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Can be used to track analytics in the future
  return NextResponse.json({ success: true });
}
