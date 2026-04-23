'use client';
import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Users, PhoneOff, ArrowLeft, Radio, MoreHorizontal, MessageCircle, Heart, Zap, Play } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { DbRoom } from '@/lib/db';
import './rooms.css';

function RoomSkeleton() {
  return (
    <div className="nebula-session-card shimmer">
      <div style={{ display: 'flex', gap: '20px' }}>
         <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--bg-secondary)' }} />
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ width: '40%', height: '14px', background: 'var(--bg-secondary)', borderRadius: '4px' }} />
            <div style={{ width: '80%', height: '22px', background: 'var(--bg-secondary)', borderRadius: '4px' }} />
         </div>
      </div>
    </div>
  );
}

export default function Rooms() {
  const { rooms, isInitializing, userProfile } = useAppContext();
  const [activeRoom, setActiveRoom] = useState<DbRoom | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');

  const participants = [
    { id: 1, name: 'Mentor Nexus', active: true, color: 'var(--accent-primary)', image: 'M' },
    { id: 2, name: 'Student Orbit', active: false, color: 'var(--accent-secondary)', image: 'S' },
  ];

  if (activeRoom) {
    return (
      <div className="nebula-session-viewport animate-fade-in">
        <header className="session-header-cinematic">
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             <button className="back-btn" onClick={() => setActiveRoom(null)}><ArrowLeft size={24} /></button>
             <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900 }}>{activeRoom.topic}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <div className="skiller-count">PULSE LIVE</div>
                   <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeRoom.participantsCount} SKILLERS SYNCED</span>
                </div>
             </div>
           </div>
           <button className="comms-action-icon" style={{ background: 'none', border: 'none' }}><MoreHorizontal size={24} /></button>
        </header>

        <main className="session-video-stream">
           {participants.map(p => (
             <div key={p.id} className="participant-node">
                <div className="participant-placeholder" style={{ borderColor: p.color }}>{p.image}</div>
                <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>{p.name}</div>
             </div>
           ))}
        </main>

        <footer className="session-controls-dock">
           <button className="comms-action-icon" style={{ background: 'none', border: 'none', color: micOn ? 'white' : 'var(--error)' }} onClick={() => setMicOn(!micOn)}>
             {micOn ? <Mic size={24} /> : <MicOff size={24} />}
           </button>
           <button className="comms-action-icon" style={{ background: 'none', border: 'none', color: videoOn ? 'white' : 'var(--error)' }} onClick={() => setVideoOn(!videoOn)}>
             {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
           </button>
           <button className="comms-action-icon" style={{ background: 'none', border: 'none' }} onClick={() => alert("Live Chat Panel opening...")}><MessageCircle size={24} /></button>
           <button className="comms-action-icon" style={{ background: 'none', border: 'none' }} onClick={() => alert("Sending Heart Reaction!")}><Heart size={24} /></button>
           <button className="btn-nebula" style={{ background: 'var(--error)', border: 'none' }} onClick={() => setActiveRoom(null)}>DISCONNECT</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="workshop-orbit-wrapper animate-fade-in">
      <header className="workshop-header-nebula">
        <div>
          <h1>Workshop Orbit</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Sync with live sessions or initialize your own learning frequency.</p>
        </div>
        <div className="pulse-indicator">
           <Radio size={18} />
           <span>{isInitializing ? 'LOADING' : rooms.length} ACTIVE ORBITS</span>
           <button className="btn-stellar" style={{ marginLeft: '20px', padding: '10px 20px', fontSize: '11px' }} onClick={() => setShowCreateModal(true)}>START ORBIT</button>
        </div>
      </header>

      <div className="workshop-grid">
        {isInitializing ? (
          [1,2,3,4].map(i => <RoomSkeleton key={i} />)
        ) : (
          rooms.map(room => (
            <div key={room.id} className="nebula-session-card" onClick={() => setActiveRoom(room)}>
              <div className="host-nebula-box">
                 <div className="host-avatar-squircle" style={{ background: `linear-gradient(135deg, ${room.color}, #000)` }}>{room.host.charAt(0)}</div>
                 <div style={{ flex: 1 }}>
                    <div className="skiller-count" style={{ display: 'inline-block' }}>{room.participantsCount} SYNCED</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>BY {room.host.toUpperCase()}</div>
                 </div>
              </div>
              <div className="session-body">
                 <h3>{room.topic}</h3>
              </div>
              <button className="btn-stellar" style={{ width: '100%', borderRadius: '16px' }}>SYNC FREQUENCY</button>
            </div>
          ))
        )}

        {!isInitializing && rooms.length === 0 && (
          <div className="glass-pane" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
             <Zap size={48} color="var(--accent-primary)" style={{ opacity: 0.3, marginBottom: '20px' }} />
             <h2>No Active Orbits</h2>
             <p style={{ color: 'var(--text-muted)' }}>The pulse is quiet. Initialize your own workshop and lead the swap.</p>
             <button className="btn-stellar" style={{ marginTop: '20px' }} onClick={() => setShowCreateModal(true)}>Initialize Session</button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="nebula-modal-overlay animate-fade-in" onClick={() => setShowCreateModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
           <div className="glass-pane animate-pop" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px' }}>Initialize Orbit</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' }}>Set your workshop frequency and invite others to sync.</p>
              
              <div style={{ marginBottom: '30px' }}>
                 <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Workshop Topic</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   placeholder="e.g. Advanced UI Motion Masterclass" 
                   style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '14px', color: 'white', outline: 'none' }}
                   value={newTopic}
                   onChange={e => setNewTopic(e.target.value)}
                 />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                 <button className="btn-nebula" style={{ flex: 1, background: 'none', border: '1px solid var(--glass-border)' }} onClick={() => setShowCreateModal(false)}>ABORT</button>
                 <button className="btn-stellar" style={{ flex: 2 }} onClick={() => { setActiveRoom({ id: 'new', topic: newTopic, host: userProfile.username, participantsCount: 1, color: 'var(--accent-primary)' } as DbRoom); setShowCreateModal(false); }}>LAUNCH SESSION</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
