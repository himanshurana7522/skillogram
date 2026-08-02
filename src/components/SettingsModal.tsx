'use client';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ChevronRight, Shield, Archive, UserCog, Bell, Moon, LogOut, ArrowLeft, Trash2, AlertTriangle, UserX } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useNotification } from '@/context/NotificationContext';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export function SettingsModal({ onClose, isOpen }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  const [notifications, setNotifications] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'main' | 'archive' | 'privacy' | 'account'>('main');

  const handleDeleteAccount = () => {
    if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      addNotification({ type: 'error', title: 'Account Deletion', message: 'Account deletion request submitted. Logging out...' });
      setTimeout(() => signOut({ callbackUrl: '/login' }), 2000);
    }
  };

  const handleNotImplemented = (feature: string) => {
    addNotification({ type: 'system', title: 'Feature Disabled', message: `${feature} is currently under maintenance.` });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-bounce" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          {activeMenu !== 'main' ? (
            <button className="close-btn" style={{ fontSize: '1.2rem' }} onClick={() => setActiveMenu('main')}>
              <ArrowLeft size={24}/>
            </button>
          ) : (
            <h2>Settings & Activity</h2>
          )}
          
          {activeMenu !== 'main' && (
            <h2 style={{textTransform: 'capitalize'}}>{activeMenu}</h2>
          )}
          
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {activeMenu === 'main' && (
          <div className="settings-options">
            
            {/* Meta-like Account Center */}
            <div className="setting-menu-item" onClick={() => setActiveMenu('account')}>
              <div className="s-icon"><UserCog size={20} /></div>
              <span>Account Center</span>
              <ChevronRight className="chevron" size={20} />
            </div>

            <div className="setting-menu-item" onClick={() => setActiveMenu('privacy')}>
              <div className="s-icon"><Shield size={20} /></div>
              <span>Privacy & Security</span>
              <ChevronRight className="chevron" size={20} />
            </div>

            <div className="setting-menu-item" onClick={() => setActiveMenu('archive')}>
              <div className="s-icon"><Archive size={20} /></div>
              <span>Archive</span>
              <ChevronRight className="chevron" size={20} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '8px 0' }} />

            {/* Direct Toggles */}
            <div className="setting-item">
              <div className="setting-info">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Moon size={20} />
                  <h4>Light Theme</h4>
                </div>
              </div>
              <div 
                className={`toggle-switch ${theme === 'light' ? 'active' : ''}`}
                onClick={toggleTheme}
              ></div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Bell size={20} />
                  <h4>Notifications</h4>
                </div>
              </div>
              <div 
                className={`toggle-switch ${notifications ? 'active' : ''}`}
                onClick={() => setNotifications(!notifications)}
              ></div>
            </div>

            <div className="setting-menu-item" style={{ color: '#FF3366', marginTop: '12px' }} onClick={() => signOut({ callbackUrl: '/login' })}>
              <div className="s-icon"><LogOut size={20} /></div>
              <span>Log Out</span>
            </div>
          </div>
        )}

        {/* Sub Menus */}
        {activeMenu === 'archive' && (
          <div className="settings-options" style={{ textAlign: 'center', padding: '40px 0' }}>
            <Archive size={48} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
            <h3>No Archived Rooms</h3>
            <p style={{ color: 'var(--text-muted)' }}>Rooms you save will appear here.</p>
          </div>
        )}

        {activeMenu === 'privacy' && (
          <div className="settings-options">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Private Account</h4>
                <p>Only approved users can join your rooms.</p>
              </div>
              <div className="toggle-switch"></div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Activity Status</h4>
                <p>Show when you are active to matches.</p>
              </div>
              <div className="toggle-switch active"></div>
            </div>
            <div className="setting-menu-item" onClick={() => handleNotImplemented('Blocked Users')}>
              <div className="s-icon"><UserX size={20} /></div>
              <span>Blocked Users</span>
              <ChevronRight className="chevron" size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="setting-menu-item" onClick={() => handleNotImplemented('Report History')}>
              <div className="s-icon"><AlertTriangle size={20} /></div>
              <span>Report History</span>
              <ChevronRight className="chevron" size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        )}

        {activeMenu === 'account' && (
          <div className="settings-options">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Two-Factor Authentication</h4>
                <p>Protect your account with 2FA.</p>
              </div>
              <ChevronRight className="chevron" size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="setting-item" onClick={() => handleNotImplemented('Connected Accounts')}>
              <div className="setting-info">
                <h4>Connected Accounts</h4>
                <p>Manage Google and Facebook logins.</p>
              </div>
              <ChevronRight className="chevron" size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '16px 0' }} />
            <div className="setting-menu-item" style={{ color: '#FF3366' }} onClick={handleDeleteAccount}>
              <div className="s-icon"><Trash2 size={20} /></div>
              <span>Delete Account</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
