import { NextResponse } from 'next/server';
import { MOCK_DB } from '@/lib/db';

// Simulated delay for realism
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  await delay(800); // simulate network latency
  return NextResponse.json({ rooms: MOCK_DB.rooms });
}

export async function POST(request: Request) {
  await delay(600);
  const data = await request.json();
  
  const newRoom = {
    id: Date.now().toString(),
    topic: data.topic,
    type: data.type || 'video',
    host: 'You',
    participantsCount: 1,
    color: '#FF3366',
  };
  
  MOCK_DB.rooms.unshift(newRoom);
  return NextResponse.json({ success: true, room: newRoom }, { status: 201 });
}
