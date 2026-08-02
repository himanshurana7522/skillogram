import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Community } from '@/models/Community';

export async function GET() {
  try {
    await dbConnect();
    let communities = await Community.find({}).lean();
    
    // Seed if empty
    if (communities.length === 0) {
      const initialCommunities = [
        { name: 'Frontend Alchemists', description: 'Advanced UI/UX, React, and motion design discussions for senior engineers.', members: [], activeCount: 432, color: 'var(--accent-secondary)', icon: 'LayoutGrid' },
        { name: 'AI Nexus', description: 'Exploring LLMs, ML models, and prompt engineering strategies.', members: [], activeCount: 890, color: 'var(--accent-primary)', icon: 'Code' },
        { name: 'Design Maestros', description: 'Share your Figma files, critique portfolios, and talk color theory.', members: [], activeCount: 1100, color: '#F43F5E', icon: 'Brush' },
        { name: 'Backend Scalers', description: 'System design, database optimization, and high availability architectures.', members: [], activeCount: 300, color: '#10B981', icon: 'Shield' }
      ];
      await Community.insertMany(initialCommunities);
      communities = await Community.find({}).lean();
    }
    
    return NextResponse.json({ communities });
  } catch (error) {
    console.error('Failed to fetch communities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
