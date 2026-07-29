import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Room from '@/models/Room';

export async function GET() {
  try {
    await dbConnect();
    
    const rooms = await Room.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedRooms = rooms.map(r => ({
      id: r._id.toString(),
      topic: r.topic,
      type: r.type,
      host: r.host,
      participantsCount: r.participantsCount,
      color: r.color
    }));

    return NextResponse.json({ rooms: formattedRooms });
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await dbConnect();

    const newRoom = await Room.create({
      topic: data.topic,
      type: data.type || 'video',
      host: session.user.name || 'User',
      hostId: session.user.id,
      participantsCount: 1,
      color: session.user.color || '#B535F6'
    });
    
    return NextResponse.json({ 
      success: true, 
      room: {
        id: newRoom._id.toString(),
        topic: newRoom.topic,
        type: newRoom.type,
        host: newRoom.host,
        participantsCount: newRoom.participantsCount,
        color: newRoom.color
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
