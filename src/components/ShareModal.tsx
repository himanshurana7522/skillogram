'use client';
import React from 'react';
import { Hash, Globe, Link2, Mail, MessageSquare } from 'lucide-react';
import './FeedModals.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: number | null;
}

export function ShareModal({ isOpen, onClose, reelId }: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="slide-up-overlay" onClick={onClose}>
      <div className="slide-up-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-drag-handle" />
        <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Share to</h3>
        
        <div className="share-grid">
          <button className="share-btn">
            <div className="icon-circle"><MessageSquare size={24} /></div>
            <span>Message</span>
          </button>
          <button className="share-btn">
            <div className="icon-circle" style={{ color: '#1DA1F2' }}><Hash size={24} /></div>
            <span>Social</span>
          </button>
          <button className="share-btn">
            <div className="icon-circle" style={{ color: '#1877F2' }}><Globe size={24} /></div>
            <span>Web</span>
          </button>
          <button className="share-btn">
            <div className="icon-circle"><Mail size={24} /></div>
            <span>Email</span>
          </button>
        </div>

        <div className="copy-link-area">
          <input type="text" readOnly value={`https://skillswap.app/reel/${reelId || ''}`} />
          <button onClick={() => alert('Link Copied!')}>Copy</button>
        </div>
      </div>
    </div>
  );
}
