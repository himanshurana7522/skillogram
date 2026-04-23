'use client';
import React, { useState } from 'react';
import { X, Zap, Type, Music, Settings, Camera, Image as ImageIcon, Circle, RefreshCw, Sparkles, Wand2 } from 'lucide-react';

interface PulseCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PulseCreator({ isOpen, onClose }: PulseCreatorProps) {
  const [activeMode, setActiveMode] = useState<'Post' | 'Story' | 'Reel' | 'Live'>('Reel');
  const [activeFilter, setActiveFilter] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const filters = [
    { name: 'Normal', color: 'transparent' },
    { name: 'Nebula', color: 'rgba(139, 92, 246, 0.2)' },
    { name: 'Orbit', color: 'rgba(59, 130, 246, 0.2)' },
    { name: 'Emerald', color: 'rgba(16, 185, 129, 0.2)' },
  ];

  const modes: ('Post' | 'Story' | 'Reel' | 'Live')[] = ['Post', 'Story', 'Reel', 'Live'];

  return (
    <div className="camera-fullscreen-overlay animate-fade-in">
      <div className="camera-viewport" style={{ backgroundColor: '#020205' }}>
        
        {/* Simulated Camera Viewfinder with Filter */}
        <div className="camera-feed" style={{ background: filters[activeFilter].color }}>
          <div className="crosshair" />
        </div>

        {/* Top Controls */}
        <header className="camera-top-bar">
          <button className="cam-icon-btn" onClick={onClose}><X size={28} /></button>
          <button className="cam-icon-btn" style={{ background: 'rgba(255,255,255,0.15)' }}><Zap size={22} fill="white" /></button>
          <button className="cam-icon-btn"><Settings size={28} /></button>
        </header>

        {/* Left Toolbar (Like Instagram/Tiktok) */}
        <div className="camera-side-toolbar">
          <button className="cam-tool-btn" onClick={() => alert("Text Editor Opening...")}><Type size={22} /><span>Text</span></button>
          <button className="cam-tool-btn" onClick={() => alert("Audio Library Opening...")}><Music size={22} /><span>Audio</span></button>
          <button className="cam-tool-btn" onClick={() => alert("Fetching Creator Effects...")}><Wand2 size={22} /><span>Effects</span></button>
          <button className="cam-tool-btn" onClick={() => alert("Retouch smoothing activated.")}><Sparkles size={22} /><span>Retouch</span></button>
        </div>

        {/* Bottom Controls */}
        <footer className="camera-bottom-panel">
          
          <div className="filter-carousel">
             {filters.map((f, i) => (
                <div key={f.name} className={`filter-blob ${i === activeFilter ? 'active' : ''}`} onClick={() => setActiveFilter(i)}>
                  <div className="blob-inner" style={{ background: f.color !== 'transparent' ? f.color : '#333' }}>
                     {i === 0 && <Camera size={14} />}
                  </div>
                  <span>{f.name}</span>
                </div>
             ))}
          </div>

          <div className="camera-actions">
             <button className="gallery-btn" onClick={() => alert("Navigating to Camera Roll...")}>
                <ImageIcon size={24} />
             </button>

             <div 
               className={`shutter-btn-wrapper ${isRecording ? 'recording' : ''}`}
               onClick={() => {
                 if(activeMode === 'Reel' || activeMode === 'Story' || activeMode === 'Live') {
                   setIsRecording(!isRecording);
                 } else {
                   // simulated snap pop
                 }
               }}
             >
                <div className="shutter-outer">
                   <div className="shutter-inner" />
                </div>
             </div>

             <button className="flip-btn" onClick={() => alert("Flipping to front/rear camera...")}>
                <RefreshCw size={24} />
             </button>
          </div>

          <div className="camera-modes">
             {modes.map(mode => (
               <button 
                 key={mode} 
                 className={`mode-text ${activeMode === mode ? 'active' : ''}`}
                 onClick={() => setActiveMode(mode)}
               >
                 {mode}
               </button>
             ))}
          </div>
        </footer>
      </div>

      <style jsx>{`
        .camera-fullscreen-overlay {
          position: fixed; inset: 0; z-index: 6000;
          background: black;
          display: flex; justify-content: center; align-items: center;
        }
        .camera-viewport {
          width: 100%; height: 100%; max-width: 500px;
          position: relative; overflow: hidden;
          background: #111;
        }
        @media (min-width: 769px) {
          .camera-viewport { height: 90vh; border-radius: 40px; border: 1px solid var(--glass-border); }
        }
        .camera-feed {
          position: absolute; inset: 0;
          display: flex; justify-content: center; align-items: center;
          transition: background 0.3s;
        }
        .crosshair { width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; }
        
        .camera-top-bar {
          position: absolute; top: 0; left: 0; right: 0;
          padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; z-index: 10;
        }
        .cam-icon-btn { background: none; border: none; color: white; cursor: pointer; border-radius: 50%; padding: 6px; }
        
        .camera-side-toolbar {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 20px; z-index: 10;
        }
        .cam-tool-btn {
          background: rgba(0,0,0,0.4); border: none; color: white; border-radius: 20px;
          padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
          backdrop-filter: blur(10px);
        }
        .cam-tool-btn span { font-size: 10px; font-weight: 700; text-shadow: 0 1px 2px black; }

        .camera-bottom-panel {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          padding: 40px 0 20px; z-index: 10;
          display: flex; flex-direction: column; align-items: center; gap: 30px;
        }

        .filter-carousel {
          display: flex; gap: 15px; overflow-x: auto; padding: 0 20px; width: 100%; justify-content: center;
          scrollbar-width: none;
        }
        .filter-blob { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; opacity: 0.6; transition: 0.3s; }
        .filter-blob.active { opacity: 1; transform: scale(1.1); }
        .blob-inner { width: 50px; height: 50px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; }
        .filter-blob span { font-size: 11px; font-weight: 700; color: white; }

        .camera-actions {
          display: flex; align-items: center; justify-content: space-evenly; width: 100%; padding: 0 40px;
        }
        .gallery-btn, .flip-btn {
          background: rgba(255,255,255,0.15); border: none; color: white; width: 44px; height: 44px; border-radius: 14px;
          display: flex; justify-content: center; align-items: center; cursor: pointer; backdrop-filter: blur(10px);
        }
        
        .shutter-btn-wrapper {
          width: 80px; height: 80px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
          cursor: pointer; position: relative;
        }
        .shutter-outer {
          position: absolute; inset: 0; border-radius: 50%; border: 4px solid var(--accent-primary);
          transition: all 0.3s;
        }
        .shutter-inner {
          position: absolute; inset: 6px; background: white; border-radius: 50%; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .shutter-btn-wrapper.recording .shutter-outer { border-color: #F43F5E; transform: scale(1.2); }
        .shutter-btn-wrapper.recording .shutter-inner { background: #F43F5E; border-radius: 12px; inset: 20px; }

        .camera-modes {
          display: flex; gap: 20px; background: rgba(0,0,0,0.5); padding: 10px 24px; border-radius: 30px; backdrop-filter: blur(20px);
        }
        .mode-text {
          background: none; border: none; color: var(--text-muted); font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.3s;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .mode-text.active { color: white; text-shadow: 0 0 10px white; }
      `}</style>
    </div>
  );
}
