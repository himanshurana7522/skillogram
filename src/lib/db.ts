export type DbRoom = {
  id: string;
  topic: string;
  type: 'video' | 'audio';
  host: string;
  participantsCount: number;
  color: string;
};

export type DbUser = {
  id: string;
  name: string;
  username: string;
  age: number;
  rating: number;
  bio: string;
  teachingSkills: string[];
  learningSkills: string[];
  color: string;
  initials: string;
  accountType: 'personal' | 'creator' | 'business';
  isPrivate: boolean;
  avatarUrl?: string;
};

export type DbComment = {
  id: string;
  userId: string;
  username: string;
  text: string;
  time: string;
  likes: number;
  replies?: DbComment[];
};

export type DbPost = {
  id: string;
  userId: string;
  authorName: string;
  type: 'image' | 'video' | 'carousel';
  mediaUrls: string[];
  caption: string;
  hashtags: string[];
  location?: string;
  likes: string[]; // User IDs
  commentCount: number;
  createdAt: string;
  isPinned: boolean;
};

export type DbStory = {
  id: string;
  userId: string;
  username: string;
  mediaUrl: string;
  type: 'image' | 'video';
  expiresAt: string;
  isHighlight: boolean;
};

export type DbMessage = {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isOwn?: boolean;
  type: 'text' | 'voice' | 'media';
  reactions?: Record<string, string>; // userId: emoji
};

export type DbReel = {
  id: number;
  title: string;
  author: string;
  color: string;
  views: string;
  skill: string;
  likes: number;
};

export type DbActivity = {
  watchHistory: { id: string; type: 'reel' | 'post'; time: string }[];
  searchHistory: string[];
  timeSpent: number; // minutes
};

export type DbThread = {
  id: string;
  authorName: string;
  authorInitials: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  time: string;
};

export type DbCommunity = {
  id: string;
  name: string;
  description: string;
  members: number;
  tags: string[];
  color: string;
  threads: DbThread[];
};

export const MOCK_DB: {
  profile: DbUser;
  rooms: DbRoom[];
  reels: DbReel[];
  posts: DbPost[];
  stories: DbStory[];
  messages: DbMessage[];
  userPool: DbUser[];
  communities: DbCommunity[];
  connections: string[]; // Following IDs
  followers: string[]; // Follower IDs
  closeFriends: string[];
  activity: DbActivity;
} = {
  profile: {
    id: 'me',
    name: 'Alex Oole',
    username: '@alexdesign',
    age: 26,
    rating: 5.0,
    bio: "Product Designer crafting premium, interactive experiences. Let's swap knowledge!",
    teachingSkills: ['Figma', 'CSS', 'UI/UX', 'Prototyping'],
    learningSkills: ['Next.js', 'AWS', 'TypeScript', 'React'],
    color: 'linear-gradient(135deg, #B535F6, #2D8CFF)',
    initials: 'AO',
    accountType: 'creator',
    isPrivate: false,
  },
  rooms: [
    { id: '1', topic: 'Learn Advanced React', type: 'video', host: 'Alice', participantsCount: 4, color: '#B535F6' },
    { id: '2', topic: 'Figma Auto Layout Mastery', type: 'video', host: 'Alex', participantsCount: 2, color: '#2D8CFF' },
  ],
  reels: [
    { id: 1, title: 'Advanced React Patterns', author: '@codewithj', color: '#B535F6', views: '12.4K', skill: 'React', likes: 1200 },
    { id: 2, title: 'Framer Motion Basics', author: '@animator', color: '#2D8CFF', views: '8.1K', skill: 'Animation', likes: 800 },
  ],
  posts: [
    {
      id: 'p1',
      userId: '1',
      authorName: 'Elena Martinez',
      type: 'image',
      mediaUrls: ['https://images.unsplash.com/photo-1558655146-d09347e92766'],
      caption: 'New design system landing page is finally live! #ui #design #figma',
      hashtags: ['ui', 'design', 'figma'],
      location: 'Barcelona, Spain',
      likes: ['me', '2', '3'],
      commentCount: 15,
      createdAt: '2h ago',
      isPinned: true,
    },
    {
      id: 'p2',
      userId: '2',
      authorName: 'Marcus Dev',
      type: 'carousel',
      mediaUrls: ['#00D1FF', '#2D8CFF'],
      caption: '3 Tips for better API performance using Next.js. Swipe to see more!',
      hashtags: ['nextjs', 'performance', 'dev'],
      likes: ['me', '4'],
      commentCount: 8,
      createdAt: '5h ago',
      isPinned: false,
    }
  ],
  stories: [
    { id: 's1', userId: '1', username: 'elena_de', mediaUrl: '#B535F6', type: 'image', expiresAt: '24h', isHighlight: false },
    { id: 's2', userId: '2', username: 'm_dev', mediaUrl: '#00D1FF', type: 'image', expiresAt: '24h', isHighlight: false },
    { id: 's3', userId: '3', username: 'sarah_talks', mediaUrl: '#FF3366', type: 'image', expiresAt: '23h', isHighlight: false },
  ],
  messages: [
    { id: '1', sender: 'Alice', avatar: 'A', text: 'Hey! Ready to swap Figma tips?', time: '2:34 PM', type: 'text' },
  ],
  userPool: [
    {
      id: '1',
      name: 'Elena',
      username: '@elena_de',
      age: 24,
      rating: 4.9,
      bio: '"Looking to swap design skills for frontend engineering!"',
      teachingSkills: ['Figma', 'UI/UX'],
      learningSkills: ['React', 'Tailwind', 'Next.js'],
      color: 'linear-gradient(135deg, #2D8CFF, #B535F6)',
      initials: 'E',
      accountType: 'creator',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Marcus',
      username: '@m_dev',
      age: 28,
      rating: 4.7,
      bio: '"Backend dev needing help with CSS Grid and Animations."',
      teachingSkills: ['Node.js', 'PostgreSQL', 'AWS'],
      learningSkills: ['CSS', 'Framer', 'UI/UX'],
      color: 'linear-gradient(135deg, #00D1FF, #2D8CFF)',
      initials: 'M',
      accountType: 'personal',
      isPrivate: false,
    },
  ],
  communities: [
    { 
      id: 'figma-wizards', 
      name: 'Figma Wizards', 
      description: 'Master auto-layout, components, and variables.', 
      members: 1240, 
      tags: ['UI', 'Design'], 
      color: '#B535F6',
      threads: [
        { id: 't1', title: 'Best plugins for 2024?', authorName: 'Sarah', authorInitials: 'S', content: 'What are your must-have plugins for a workflow update?', likes: 45, replies: 12, time: '2h ago' }
      ]
    },
    { 
      id: 'react-masters', 
      name: 'React Masters', 
      description: 'Deep dives into hooks, state, and patterns.', 
      members: 890, 
      tags: ['React', 'Frontend'], 
      color: '#2D8CFF',
      threads: []
    }
  ],
  connections: ['1', '2'], // Following
  followers: ['3', '4', '5'],
  closeFriends: ['1'],
  activity: {
    watchHistory: [],
    searchHistory: ['React', 'Figma'],
    timeSpent: 45,
  },
};

