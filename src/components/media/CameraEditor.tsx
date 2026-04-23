'use client';
import React, { useState } from 'react';
import { X, Zap, Timer, Music, Scissors, Type, Smile, MoreHorizontal, Video, Image, ChevronLeft } from 'lucide-react';
import './media.css';

interface CameraEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraEditor({ isOpen, onClose }: CameraEditorProps) {
  const [activeMode, setActiveMode] = useState<'reels' | 'story' | 'post'>('reels');
  const [activeFilter, setActiveFilter] = useState(0);

  if (!isOpen) return null;

  const filters = [
    { title: 'Normal', color: '#121212' },
    { title: 'Neon', color: 'var(--neon-purple)' },
    { title: 'Sky', color: 'var(--neon-blue)' },
    { title: 'Fire', color: '#FF3366' },
  ];

  return (
    <div className="camera-container animate-fade-in">
      <header className="camera-header">
        <button className="back-btn" onClick={onClose}><X size={28} /></button>
        <div className="header-meta"><Zap size={24} /></div>
        <button className="tool-btn"><Timer size={24} /></button>
      </header>

      <main className="camera-preview" style={{ background: `linear-gradient(135deg, #121212, ${filters[activeFilter].color}44)` }}>
        <div className="camera-side-tools">
          <button className="tool-btn"><Music size={22} /><span>Audio</span></button>
          <button className="tool-btn"><Scissors size={22} /><span>Trim</span></button>
          <button className="tool-btn"><Type size={22} /><span>Text</span></button>
          <button className="tool-btn"><Smile size={22} /><span>Stickers</span></button>
          <button className="tool-btn"><MoreHorizontal size={22} /><span>More</span></button>
        </div>

        <div className="preview-indicator">
          {activeMode === 'reels' ? <Video size={48} opacity={0.3} /> : <Image size={48} opacity={0.3} />}
          <p className="mt-4 opacity-50">Camera Simulator Active</p>
        </div>
      </main>

      <footer className="filter-footer">
        <div className="filter-carousel">
          {filters.map((f, i) => (
            <div 
              key={i} 
              className={`filter-item ${i === activeFilter ? 'active' : ''}`}
              onClick={() => setActiveFilter(i)}
              style={{ background: f.color }}
            />
          ))}
          <div className="filter-item record"><div className="record-inner" /></div>
          <div className="filter-item" style={{ opacity: 0.5 }} />
        </div>
      </footer>

      <div className="mode-selector">
        <button className={`mode-btn ${activeMode === 'post' ? 'active' : ''}`} onClick={() => setActiveMode('post')}>Post</button>
        <button className={`mode-btn ${activeMode === 'story' ? 'active' : ''}`} onClick={() => setActiveMode('story')}>Story</button>
        <button className={`mode-btn ${activeMode === 'reels' ? 'active' : ''}`} onClick={() => setActiveMode('reels')}>Reels</button>
      </div>
    </div>
  );
}
