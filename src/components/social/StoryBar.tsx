'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Radio } from 'lucide-react';
import './social.css';

export function StoryBar() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch('/api/social/stories');
        if (res.ok) {
          const data = await res.json();
          setGroups(data.storyGroups || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStories();
  }, []);

  if (isLoading) return (
    <div className="story-bar-container">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="story-item" style={{ opacity: 0.5 }}>
          <div className="story-avatar-ring skeleton" />
          <div className="story-name skeleton" style={{ width: '40px', height: '10px' }} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="story-bar-container">
      <div className="story-item me">
        <div className="story-avatar-ring" style={{ background: 'var(--glass-highlight)' }}>
          <div className="story-avatar" style={{ position: 'relative' }}>
             AO
             <div style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--accent-primary)', borderRadius: '50%', padding: '2px' }}>
               <Plus size={12} color="white" />
             </div>
          </div>
        </div>
        <span className="story-name">Pulse</span>
      </div>
      
      {groups.map(group => (
        <div key={group.userId} className="story-item animate-fade-in">
          <div className="story-avatar-ring">
            <div className="story-avatar">
              {group.username.substring(1, 2).toUpperCase()}
            </div>
          </div>
          <span className="story-name">{group.username.replace('@', '')}</span>
          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-tertiary)', marginTop: '-8px' }}>LIVE</div>
        </div>
      ))}
    </div>
  );
}
