-- Schema outline for Skillogram Nebula Backend inside Supabase PostgreSQL

-- Enable UUID extension globally
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Auth + Profile data)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  age INTEGER,
  rating DECIMAL(2,1) DEFAULT 0.0,
  bio TEXT,
  teaching_skills TEXT[] DEFAULT '{}',
  learning_skills TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#8B5CF6',
  initials TEXT,
  account_type TEXT DEFAULT 'personal', -- personal, creator, business
  is_private BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rooms Table (Live Workshops)
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  type TEXT DEFAULT 'video', -- video or audio
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  participants_count INTEGER DEFAULT 0,
  color TEXT DEFAULT '#B535F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 3. Posts Table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'image', -- image, video, carousel
  media_urls TEXT[] NOT NULL,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  location TEXT,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT false
);

-- 4. Post Likes
CREATE TABLE public.post_likes (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- 5. Reels Table
CREATE TABLE public.reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  color TEXT DEFAULT '#B535F6',
  views_count INTEGER DEFAULT 0,
  skill TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Communities Table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  members_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Threads (Community Discussions)
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Messages Table (Real-time Chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id TEXT NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  sender_username TEXT NOT NULL,
  sender_avatar TEXT,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Note: In a production Supabase app, RLS (Row Level Security) policies should be added here:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (!is_private);
