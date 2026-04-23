'use client';
import React, { useState } from 'react';
import { Users, Presentation, Shield, Code, Brush, LayoutGrid, ArrowRight } from 'lucide-react';
import './communities.css';
import { useAppContext } from '@/context/AppContext';

const MOCK_COMMUNITIES = [
  { id: 1, name: 'Frontend Alchemists', description: 'Advanced UI/UX, React, and motion design discussions for senior engineers.', members: 12500, active: 432, color: 'var(--accent-secondary)', icon: <LayoutGrid size={32} color="white" /> },
  { id: 2, name: 'AI Nexus', description: 'Exploring LLMs, ML models, and prompt engineering strategies.', members: 8900, active: 890, color: 'var(--accent-primary)', icon: <Code size={32} color="white" /> },
  { id: 3, name: 'Design Maestros', description: 'Share your Figma files, critique portfolios, and talk color theory.', members: 21000, active: 1100, color: '#F43F5E', icon: <Brush size={32} color="white" /> },
  { id: 4, name: 'Backend Scalers', description: 'System design, database optimization, and high availability architectures.', members: 15400, active: 300, color: '#10B981', icon: <Shield size={32} color="white" /> }
];

export default function Communities() {
  const { isInitializing } = useAppContext();

  if (isInitializing) {
    return <div className="communities-wrapper shimmer" style={{ height: '100vh', borderRadius: '20px' }} />;
  }

  return (
    <div className="communities-wrapper animate-fade-in">
      <header className="communities-header">
        <h1>Professional Communities</h1>
        <p>Join highly specialized skill groups to level up your craft and expand your orbital network.</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
          <button className="btn-stellar" onClick={() => alert("Loading discovery algorithm...")}>Discover Groups</button>
          <button className="btn-secondary" onClick={() => alert("Loading your saved networks...")}>Your Networks</button>
        </div>
      </header>

      <div className="community-grid">
        {MOCK_COMMUNITIES.map(comm => (
          <div key={comm.id} className="community-card glass-pane" onClick={() => alert(`Entering ${comm.name} community hub...`)}>
            <div className="community-banner" style={{ background: `linear-gradient(135deg, ${comm.color}, #08080C)` }}>
              <div className="community-banner-overlay" />
              <div className="community-icon-container" style={{ background: comm.color }}>
                {comm.icon}
              </div>
            </div>
            
            <div className="community-content">
              <h3>{comm.name}</h3>
              <p>{comm.description}</p>
            </div>
            
            <div className="community-meta">
              <div className="meta-item">
                <Users size={16} /> <span>{comm.members.toLocaleString()} Skillers</span>
              </div>
              <div className="meta-item" style={{ color: 'var(--accent-tertiary)' }}>
                <Presentation size={16} /> <span>{comm.active} Live</span>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                 <ArrowRight size={20} color="var(--text-muted)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
