'use client';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Bell, MessageSquare, Flame, X } from 'lucide-react';

export function NotificationToast() {
  const { notifications } = useAppContext();
  const [currentNotif, setCurrentNotif] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only show toast for very recent notifications (within last few seconds)
      // For this demo, we'll show it if it's the newest one added during the session
      setCurrentNotif(latest);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!currentNotif || !isVisible) return null;

  const Icon = currentNotif.type === 'match' ? Flame : MessageSquare;

  return (
    <div className="toast-container animate-slide-in-right glass-pane">
      <div className={`toast-icon-bg ${currentNotif.type}`}>
        <Icon size={20} color="white" />
      </div>
      <div className="toast-body">
        <h4>{currentNotif.title}</h4>
        <p>{currentNotif.message}</p>
      </div>
      <button className="toast-close" onClick={() => setIsVisible(false)}>
        <X size={16} />
      </button>

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          min-width: 320px;
          max-width: 400px;
          z-index: 9999;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .toast-icon-bg {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .toast-icon-bg.match { background: linear-gradient(135deg, #FF3366, #FF9933); }
        .toast-icon-bg.message { background: linear-gradient(135deg, #00D1FF, #2D8CFF); }
        
        .toast-body { flex: 1; }
        .toast-body h4 { font-size: 15px; font-weight: 700; margin-bottom: 2px; color: white; }
        .toast-body p { font-size: 13px; color: rgba(255,255,255,0.7); }
        
        .toast-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 4px;
        }
      `}</style>
    </div>
  );
}
