'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { DbUser, DbRoom, DbReel, DbMessage } from '@/lib/db';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';


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

  const [allMessages, setAllMessages] = useState<Record<string, DbMessage[]>>({});
  const { user } = useAuth();

  useEffect(() => {
    async function fetchInitialData() {
      if (!user) return;
      try {
        // Fetch or create profile
        const { data: profile, error: pError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (pError && pError.code === 'PGRST116') {
          // New User: Create record
          const newProfile = {
            id: user.id,
            name: user.email?.split('@')[0] || 'Unknown Skiller',
            username: `@${user.email?.split('@')[0] || 'user'}`,
            initials: (user.email?.[0] || 'U').toUpperCase(),
            color: '#8B5CF6'
          };
          await supabase.from('users').insert([newProfile]);
          setUserProfile(prev => ({ ...prev, ...newProfile }));
        } else if (profile) {
          setUserProfile(profile as any);
        }

         // Query all data from the real Supabase Postgres
        const [roomsRes, reelsRes] = await Promise.all([
          supabase.from('rooms').select('*').order('created_at', { ascending: false }),
          supabase.from('reels').select('*').order('created_at', { ascending: false }),
        ]);
        
        if (roomsRes.data) setRooms(roomsRes.data as any);
        if (reelsRes.data) setReels(reelsRes.data as any);
      } catch (error) {
        console.error('Failed to load Supabase DB data', error);
      } finally {
        setIsInitializing(false);
      }
    }
    fetchInitialData();

    // Supabase Real-Time Subscriptions for Rooms and Messages
    const roomsChannel = supabase.channel('public:rooms')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, payload => {
         setRooms(prev => [payload.new as any, ...prev]);
         addNotification({
           title: "New Live Orbit!",
           message: `A new workshop was just initialized.`,
           type: 'system'
         });
      })
      .subscribe();

    const messagesChannel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
         const newMsg = payload.new as any;
         setAllMessages(prev => {
            const roomMsgs = prev[newMsg.room_id] || [];
            return {
               ...prev,
               [newMsg.room_id]: [...roomMsgs, {
                  id: newMsg.id,
                  sender: newMsg.sender_username,
                  avatar: newMsg.sender_avatar,
                  text: newMsg.text,
                  time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: newMsg.type,
                  isOwn: newMsg.sender_username === userProfile.username
               }]
            };
         });
         
         if (newMsg.sender_username !== userProfile.username) {
            addNotification({
               type: 'message',
               title: `New Message from ${newMsg.sender_username}`,
               message: newMsg.text,
            });
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [userProfile.username]);

  const sendMessage = async (roomId: string, text: string) => {
    const { error } = await supabase.from('messages').insert([{
      room_id: roomId,
      sender_username: userProfile.username,
      sender_avatar: userProfile.initials,
      text: text,
      type: 'text'
    }]);
    
    if (error) console.error("Error sending message:", error);
  };

  const addRoom = async (topic: string, type: 'video' | 'audio') => {
    try {
      const { data, error } = await supabase.from('rooms').insert([
        { topic, type, participants_count: 1, color: '#2D8CFF' }
      ]).select().single();
      
      if (error) throw error;
      // State is handled by realtime subscription now!
    } catch (e) {
      console.error("Supabase insert error:", e);
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
