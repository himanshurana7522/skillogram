'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DbRoom, DbReel } from '@/lib/db';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

type DataContextType = {
  rooms: DbRoom[];
  addRoom: (topic: string, type: 'video' | 'audio') => void;
  reels: DbReel[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<DbRoom[]>([]);
  const [reels, setReels] = useState<DbReel[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [roomsRes, reelsRes] = await Promise.all([
          supabase.from('rooms').select('*').order('created_at', { ascending: false }),
          supabase.from('reels').select('*').order('created_at', { ascending: false }),
        ]);
        
        if (roomsRes.data) setRooms(roomsRes.data as DbRoom[]);
        if (reelsRes.data) setReels(reelsRes.data as DbReel[]);
      } catch (error) {
        console.error('Failed to load Supabase DB data', error);
      }
    }
    fetchData();

    const roomsChannel = supabase.channel('public:rooms')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, payload => {
         setRooms(prev => [payload.new as DbRoom, ...prev]);
         addNotification({
           title: "New Live Orbit!",
           message: `A new workshop was just initialized.`,
           type: 'system'
         });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
    };
  }, [user, addNotification]);

  const addRoom = async (topic: string, type: 'video' | 'audio') => {
    try {
      const { error } = await supabase.from('rooms').insert([
        { topic, type, participants_count: 1, color: '#2D8CFF' }
      ]).select().single();
      
      if (error) throw error;
    } catch (e) {
      console.error("Supabase insert error:", e);
    }
  };

  return (
    <DataContext.Provider value={{
      rooms,
      addRoom,
      reels,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
