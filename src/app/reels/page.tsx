'use client';
import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, MoreVertical, Music, Camera } from 'lucide-react';
import './reels.css';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

export default function Reels() {
  const { isInitializing } = useUser();
  const [reels, setReels] = useState<{ id?: string; author?: string; color?: string; title?: string; likes?: number; comments?: number; }[]>([]);

  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch('/api/reels');
        if (res.ok) {
          const data = await res.json();
          const reelsData = (data.reels || []).map((r: { likes?: number }) => ({
            ...r,
            likes: r.likes ?? Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 300)
          }));
          setReels(reelsData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchReels();
  }, []);

  if (isInitializing) {
    return <div className="reels-container shimmer"></div>;
  }

  return (
    <div className="reels-container animate-fade-in">
      {/* Top right camera icon for creating a reel */}
      <div className="reels-create-wrapper">
        <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Camera size={20} /> CREATE REEL
        </Button>
      </div>

      {reels.map((reel, idx) => (
        <div key={reel.id || idx} className="reel-item">
          {/* Simulated Video Placeholder */}
          <div className="reel-video-placeholder" style={{ background: `linear-gradient(135deg, ${reel.color || 'var(--accent-primary)'}, #000)` }}>
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }}>
                <Camera size={100} />
             </div>
          </div>
          
          <div className="reel-overlay">
            <div className="reel-info">
              <div className="reel-author">
                <Avatar initials={reel.author ? reel.author.charAt(0) : 'U'} size="md" isSquircle={true} />
                <h3>{reel.author || 'Nexus Skiller'}</h3>
                <Button variant="secondary" size="sm" style={{ marginLeft: '10px' }}>Follow</Button>
              </div>
              
              <div className="reel-caption">
                <b>{reel.title || 'Exploring the boundaries of UI/UX in Skillogram Nebula.'}</b> #Skillogram #Design
              </div>
              
              <div className="reel-music">
                <Music size={14} className="icon-shadow" />
                <span className="icon-shadow" style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <div className="marquee-container">Original Audio - {reel.author}</div>
                </span>
              </div>
            </div>
            
            <div className="reel-actions">
              <button className="reel-action-btn">
                <Heart size={28} className="icon-shadow" />
                <span>{reel.likes}</span>
              </button>
              <button className="reel-action-btn">
                <MessageCircle size={28} className="icon-shadow" />
                <span>{reel.comments}</span>
              </button>
              <button className="reel-action-btn">
                <Send size={28} className="icon-shadow" />
                <span>Share</span>
              </button>
              <button className="reel-action-btn">
                <MoreVertical size={28} className="icon-shadow" />
              </button>
              <div className="squircle-avatar" style={{ width: '32px', height: '32px', border: '2px solid white', marginTop: '10px' }}>
                <div style={{ width: '100%', height: '100%', background: reel.color || 'var(--accent-primary)' }} />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {reels.length === 0 && (
         <div className="reel-item" style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            <h2>No Reels available.</h2>
            <p style={{ color: 'var(--text-muted)' }}>Check back soon.</p>
         </div>
      )}
    </div>
  );
}
