import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find if a chat exists between these two users
    let chat = await Chat.findOne({
      participants: { $all: [session.user.id, contactId] }
    });

    // 2. If no chat exists, we return an empty history
    if (!chat) {
      // Optional: we can generate a mock introductory message based on the UI flow, 
      // but a true production app returns empty. For this prototype, empty is fine.
      return NextResponse.json({ history: [] });
    }

    // 3. Fetch messages for this chat
    const messages = await Message.find({ chat_id: chat._id })
      .sort({ createdAt: 1 })
      .limit(50); // Get last 50 messages

    // Format them for the frontend
    const history = messages.map(msg => ({
      id: msg._id.toString(),
      text: msg.text,
      media_url: msg.media_url,
      sender: msg.sender_id.toString() === session.user.id ? 'me' : 'them',
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contactId, text, mediaUrl } = body;

    if (!contactId || (!text && !mediaUrl)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find or create the chat thread
    let chat = await Chat.findOne({
      participants: { $all: [session.user.id, contactId] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [session.user.id, contactId]
      });
    }

    // 2. Insert the message
    const newMessage = await Message.create({
      chat_id: chat._id,
      sender_id: session.user.id,
      receiver_id: contactId,
      text: text || '',
      media_url: mediaUrl || null
    });

    // 3. Update the chat's last message pointer
    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: text || 'Sent an attachment',
      lastMessageAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: {
        id: newMessage._id.toString(),
        text: newMessage.text,
        sender: 'me',
        time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } 
    });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
