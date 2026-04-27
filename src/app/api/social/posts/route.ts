import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch posts error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  // Transform to match frontend expected DbPost format
  const formattedPosts = data.map(post => ({
    id: post.id,
    userId: post.user_id,
    authorName: post.author?.name || 'Skiller',
    authorInitials: post.author?.initials || 'S',
    authorColor: post.author?.color || '#8B5CF6',
    mediaUrls: post.media_urls || [],
    type: post.type || 'image',
    caption: post.caption || '',
    hashtags: post.hashtags || [],
    likes: (post as any).likes || [],
    comments: [],
    createdAt: new Date(post.created_at).toLocaleDateString()
  }));

  return Response.json({ posts: formattedPosts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('posts')
    .insert([body])
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, post: data });
}
