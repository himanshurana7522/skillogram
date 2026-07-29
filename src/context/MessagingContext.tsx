'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DbMessage } from '@/lib/db';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from './UserContext';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

type MessagingContextType = {
  allMessages: Record<string, DbMessage[]>;
  sendMessage: (roomId: string, text: string) => void;
};

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [allMessages, setAllMessages] = useState<Record<string, DbMessage[]>>({});
  const { userProfile } = useUser();
  const { addNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const messagesChannel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
         const newMsg = payload.new as {
            room_id: string;
            id: string;
            sender_username: string;
            sender_avatar: string;
            text: string;
            created_at: string;
            type: 'text' | 'voice' | 'media';
         };
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
      supabase.removeChannel(messagesChannel);
    };
  }, [user, userProfile.username, userProfile.initials, addNotification]);

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

  return (
    <MessagingContext.Provider value={{
      allMessages,
      sendMessage,
    }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}
