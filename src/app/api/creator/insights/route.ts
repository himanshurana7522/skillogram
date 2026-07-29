import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';
import User from '@/models/User';

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 1. Fetch user to get actual follower count
    const user = await User.findById(session.user.id);
    const totalFollowers = user?.followers?.length || 0;

    // 2. Aggregate post metrics (Total Likes, Total Comments)
    const postMetrics = await Post.aggregate([
      { $match: { user_id: user._id } },
      { 
        $group: { 
          _id: null, 
          totalLikes: { $sum: "$likesCount" },
          totalComments: { $sum: "$commentsCount" },
          postCount: { $sum: 1 }
        } 
      }
    ]);

    const metrics = postMetrics[0] || { totalLikes: 0, totalComments: 0, postCount: 0 };
    
    // Simulate reach based on real followers and likes (since we don't track pure impressions yet)
    const accountsReached = totalFollowers * 3 + metrics.totalLikes * 10;
    const accountsEngaged = metrics.totalLikes + metrics.totalComments;

    // 3. Fetch Top Content
    const topPosts = await Post.find({ user_id: user._id })
      .sort({ likesCount: -1 })
      .limit(3);

    const formattedTopContent = topPosts.map(post => ({
      id: post._id.toString(),
      type: post.type,
      media_urls: post.media_urls,
      likes: post.likesCount,
      comments: post.commentsCount
    }));

    // Construct the dynamic insights object
    const insights = {
      accountsReached: accountsReached || 120, // Fallback for empty accounts
      accountsReachedGrowth: '+12.5%', // Simulated growth logic
      accountsEngaged: accountsEngaged || 15,
      accountsEngagedGrowth: '+8.2%',
      totalFollowers: totalFollowers,
      followerGrowth: '+5',
      // Demographics are simulated until we actually collect this on the User schema
      topLocations: ['Barcelona', 'San Francisco', 'New York', 'London'],
      ageRange: { '18-24': '45%', '25-34': '38%', '35-44': '12%', '45+': '5%' },
      genderDist: { Women: '62%', Men: '35%', Other: '3%' },
      topContent: formattedTopContent,
    };

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Fetch insights error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
