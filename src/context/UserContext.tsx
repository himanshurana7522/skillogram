'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DbUser } from '@/lib/db';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

type UserContextType = {
  isInitializing: boolean;
  userProfile: DbUser;
  updateUserProfile: (profile: Partial<DbUser>) => Promise<void>;
  matches: DbUser[];
  addMatch: (user: DbUser) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [matches, setMatches] = useState<DbUser[]>([]);
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

  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setIsInitializing(false);
        return;
      }
      try {
        const { data: profile, error: pError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (pError && pError.code === 'PGRST116') {
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
          setUserProfile(profile as DbUser);
        }
      } catch (error) {
        console.error('Failed to load user profile', error);
      } finally {
        setIsInitializing(false);
      }
    }
    fetchUserProfile();
  }, [user]);

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

  const addMatch = async (matchedUser: DbUser) => {
    try {
      setMatches(prev => [...prev, matchedUser]);
      addNotification({
        type: 'match',
        title: "New Match! 🔥",
        message: `You and ${matchedUser.name} matched. Send them a message!`,
      });

      await fetch('/api/match/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: matchedUser.id }),
      });
      
      setTimeout(() => {
        addNotification({
          type: 'message',
          title: `Message from ${matchedUser.name}`,
          message: "Hey! Ready to swap skills?",
        });
      }, 5000);
    } catch (e) {
      console.error('Failed to persist match', e);
    }
  };

  return (
    <UserContext.Provider value={{
      isInitializing,
      userProfile,
      updateUserProfile,
      matches,
      addMatch,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
