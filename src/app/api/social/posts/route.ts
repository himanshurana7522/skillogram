import { MOCK_DB } from '@/lib/db';
import { rankContent } from '@/lib/algorithm';

export async function GET() {
  const posts = MOCK_DB.posts;
  // Apply personalized ranking engine
  const rankedPosts = rankContent(MOCK_DB.profile, posts, 'post');
  
  return Response.json({ posts: rankedPosts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPost = {
    id: `p${Date.now()}`,
    userId: 'me',
    authorName: MOCK_DB.profile.name,
    ...body,
    likes: [],
    commentCount: 0,
    createdAt: 'Just now',
    isPinned: false,
  };
  MOCK_DB.posts.unshift(newPost);
  return Response.json({ success: true, post: newPost });
}
