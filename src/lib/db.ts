// This file now ONLY contains TypeScript definitions for the frontend.
// The MOCK_DB has been permanently eradicated from the system.

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
  followersCount?: number;
  followingCount?: number;
  connectionsCount?: number;
};

export type DbRoom = {
  id: string;
  topic: string;
  type: 'video' | 'audio';
  host: string;
  participantsCount: number;
  color: string;
};

export type DbPost = {
  id: string;
  userId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  authorAvatarUrl?: string;
  mediaUrls: string[];
  type: 'image' | 'video' | 'text' | 'carousel';
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  location?: string;
};

export type DbReel = {
  id: string;
  userId: string;
  authorName: string;
  mediaUrl: string;
  likes: string;
  comments: string;
  shares: string;
  caption: string;
  musicTrack: string;
  color?: string;
  skill?: string;
  author?: string;
  title?: string;
};

export type DbMessage = {
  id: string;
  text: string;
  sender: 'me' | 'them' | string;
  time: string;
  media_url?: string;
  type?: 'text' | 'voice' | 'image' | 'video' | string;
};
