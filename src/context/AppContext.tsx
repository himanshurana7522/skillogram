'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { DbUser, DbRoom, DbReel, DbMessage } from '@/lib/db';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

export type AppNotification = {
  id: string;
  type: 'match' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

type AppContextType = {
  isInitializing: boolean;
  rooms: DbRoom[];
  addRoom: (topic: string, type: 'video' | 'audio') => void;
  reels: DbReel[];
  matches: DbUser[];
  addMatch: (user: DbUser) => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  userProfile: DbUser;
  updateUserProfile: (profile: Partial<DbUser>) => Promise<void>;
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) => void;
  markNotificationsAsRead: () => void;
  unreadCount: number;
  socket: Socket | null;
  allMessages: Record<string, DbMessage[]>; // ThreadId -> Messages
  sendMessage: (roomId: string, text: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [rooms, setRooms] = useState<DbRoom[]>([]);
  const [reels, setReels] = useState<DbReel[]>([]);
  const [matches, setMatches] = useState<DbUser[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [userProfile, setUserProfile] = useState<DbUser>({
    id: 'me',
    name: '',
    username: '',
    age: 0,
    rating: 0,
    bio: '',
    teachingSkills: [],
    learningSkills: [],
    color: '#8B5CF6',
    initials: '',
    accountType: 'personal',
    isPrivate: false
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [allMessages, setAllMessages] = useState<Record<string, DbMessage[]>>({});

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [roomsRes, profileRes, reelsRes] = await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/profile'),
          fetch('/api/reels'),
        ]);
        const roomsData = await roomsRes.json();
        const profileData = await profileRes.json();
        const reelsData = await reelsRes.json();

        setRooms(roomsData.rooms);
        setUserProfile(profileData.profile);
        setReels(reelsData.reels);
      } catch (error) {
        console.error('Failed to load backend data', error);
      } finally {
        setIsInitializing(false);
      }
    }
    fetchInitialData();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('receive_message', (data: { roomId: string; message: DbMessage }) => {
      setAllMessages(prev => {
        const roomMessages = prev[data.roomId] || [];
        return {
          ...prev,
          [data.roomId]: [...roomMessages, data.message]
        };
      });
      
      // Also add a notification if not on chat
      addNotification({
        type: 'message',
        title: `New Message`,
        message: data.message.text,
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (roomId: string, text: string) => {
    if (!socket) return;
    const newMessage: DbMessage = {
      id: Date.now().toString(),
      sender: userProfile.username,
      avatar: userProfile.initials,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: 'text',
    };

    socket.emit('send_message', { roomId, message: newMessage });
  };

  const addRoom = async (topic: string, type: 'video' | 'audio') => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type }),
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => [data.room, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      time: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addMatch = async (user: DbUser) => {
    try {
      setMatches(prev => [...prev, user]);
      addNotification({
        type: 'match',
        title: "New Match! 🔥",
        message: `You and ${user.name} matched. Send them a message!`,
      });

      await fetch('/api/match/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      
      // Simulated incoming message follow-up
      setTimeout(() => {
        addNotification({
          type: 'message',
          title: `Message from ${user.name}`,
          message: "Hey! Ready to swap skills?",
        });
      }, 5000);

    } catch (e) {
      console.error('Failed to persist match', e);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateUserProfile = async (profile: Partial<DbUser>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        isInitializing,
        rooms,
        addRoom,
        reels,
        matches,
        addMatch,
        theme,
        toggleTheme,
        userProfile,
        updateUserProfile,
        notifications,
        addNotification,
        markNotificationsAsRead,
        unreadCount,
        socket,
        allMessages,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
