'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';
import { UserProvider } from './UserContext';
import { DataProvider } from './DataContext';
import { MessagingProvider } from './MessagingContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <UserProvider>
            <DataProvider>
              <MessagingProvider>
                {children}
              </MessagingProvider>
            </DataProvider>
          </UserProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
