'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Star, Heart, UserPlus, MessageCircle, Zap, ShieldCheck } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { DbUser } from '@/lib/db';
import './match.css';

function MatchSkeleton() {
  return (
    <div className="nexus-card">
      <div className="shimmer" style={{ width: '100%', height: '500px' }} />
      <div style={{ padding: '40px' }}>
        <div className="shimmer" style={{ width: '60%', height: '30px', marginBottom: '20px' }} />
        <div className="shimmer" style={{ width: '100%', height: '100px' }} />
      </div>
    </div>
  );
}

export default function Match() {
  const { addMatch } = useAppContext();
  const [profiles, setProfiles] = useState<DbUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchFound, setMatchFound] = useState<DbUser | null>(null);
  
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  useEffect(() => {
    async function getSuggestions() {
      try {
        const res = await fetch('/api/match/suggestions');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data.suggestions || []);
        }
      } catch (e) {
        console.error('Failed to load match suggestions', e);
      } finally {
        setIsLoading(false);
      }
    }
    getSuggestions();
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (matchFound) return;
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - startX.current;
    setDragOffset(offset);
  };

  const swipeCard = async (direction: 'left' | 'right') => {
    if (profiles.length === 0) return;
    setIsDragging(false);
    
    const currentProfile = profiles[0];
    const finalOffset = direction === 'right' ? window.innerWidth : -window.innerWidth;
    setDragOffset(finalOffset);
    
    if (direction === 'right') {
      try {
        const res = await fetch('/api/match/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentProfile.id }),
        });
        const data = await res.json();
        if (data.isMutual) {
          setMatchFound(currentProfile);
          addMatch(currentProfile);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setTimeout(() => {
      setProfiles(prev => prev.slice(1));
      setDragOffset(0);
    }, 300);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 100) {
      swipeCard('right');
    } else if (dragOffset < -100) {
      swipeCard('left');
    } else {
      setDragOffset(0);
    }
  };

  if (isLoading) {
    return (
      <div className="match-wrapper">
        <div className="nebula-matching-header">
           <div className="match-status-glow" />
           <h2>Nexus Alignment</h2>
           <p>Synchronizing with potential skill partners</p>
        </div>
        <MatchSkeleton />
      </div>
    );
  }

  if (profiles.length === 0 && !matchFound) {
    return (
      <div className="match-wrapper empty-state">
        <div className="glass-pane animate-fade-in" style={{ padding: '60px', textAlign: 'center' }}>
          <Zap size={64} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: 24 }} />
          <h2>Orbit Complete</h2>
          <p style={{ color: 'var(--text-muted)' }}>Expand your skill mission to find more partners.</p>
          <button className="btn-stellar" style={{ marginTop: '30px' }} onClick={() => window.location.reload()}>Refresh Pulse</button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[0];

  return (
    <div className="match-wrapper" style={{ overflow: 'hidden' }}>
      <div className="nebula-matching-header">
        <div className="match-status-glow" />
        <h2>Nexus Match</h2>
        <p>Matched via Skillogram Intelligence</p>
      </div>

      <div className="discovery-orbit">
        {currentProfile && (
          <div 
            className="nexus-card animate-fade-in"
            style={{ 
              transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="card-media-nebula" style={{ background: `linear-gradient(135deg, ${currentProfile.color}44, #050508)` }}>
              <div className="nexus-avatar">{currentProfile.initials}</div>
              {dragOffset > 50 && <div className="swipe-badge like" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }}>ALIGN</div>}
              {dragOffset < -50 && <div className="swipe-badge nope" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>IGNORE</div>}
            </div>
            
            <div className="nexus-card-info">
              <div className="nexus-header">
                <h3>{currentProfile.name} <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>• {currentProfile.age}</span></h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontWeight: 800 }}>
                  <Star size={18} fill="currentColor" /> {currentProfile.rating}
                </div>
              </div>
              
              <div className="match-intelligence-badge">
                 <div className="label">NEBULA INSIGHT</div>
                 <div className="reason">{(currentProfile as any).aiReason || 'Synergestic skill overlap detected.'}</div>
              </div>

              <div className="nexus-skill-group">
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Potential Swap</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {currentProfile.teachingSkills.map(skill => <span key={skill} className="skill-orbit-tag">{skill}</span>)}
                </div>
              </div>

              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '30px' }}>{currentProfile.bio}</p>
              
              <div className="nexus-actions">
                <button className="btn-orbit-action btn-stellar" onClick={() => swipeCard('right')}>Align Nexus</button>
                <button className="btn-orbit-action" style={{ background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)', color: 'white' }} onClick={() => swipeCard('left')}>Pass</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {matchFound && (
        <div className="nebula-success-overlay animate-fade-in">
          <div className="nebula-connection-modal animate-pop">
            <h2 className="text-gradient" style={{ fontSize: '40px', fontWeight: 900, marginBottom: '20px' }}>Nexus Aligned!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>You and {matchFound.name} have formed a new skill alignment.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
              <div className="nexus-avatar" style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--accent-primary)', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AO</div>
              <div className="nexus-avatar" style={{ width: '80px', height: '80px', borderRadius: '24px', background: matchFound.color, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{matchFound.initials}</div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-stellar" style={{ flex: 1 }} onClick={() => window.location.href = '/chat'}>Enter Orbit</button>
              <button className="btn-nebula" style={{ flex: 1, background: 'none' }} onClick={() => setMatchFound(null)}>Continue Search</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
