import { NextResponse } from 'next/server';
import { MOCK_DB } from '@/lib/db';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json({ profile: MOCK_DB.profile });
}

export async function PATCH(request: Request) {
  await delay(800);
  const updates = await request.json();
  
  MOCK_DB.profile = { ...MOCK_DB.profile, ...updates };
  return NextResponse.json({ success: true, profile: MOCK_DB.profile });
}
