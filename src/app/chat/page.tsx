'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Phone, Video, MessageSquare, Mic, Info, ChevronDown, Edit, Heart, Play, Sparkles, ChevronLeft } from 'lucide-react';
import { CallOverlay } from '@/components/CallOverlay';
import { DbUser } from '@/lib/db';
import { useUser } from '@/context/UserContext';
import { useMessaging } from '@/context/MessagingContext';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import './chat.css';

export default function Chat() {
  const { isInitializing: isAppInitializing, userProfile } = useUser();
  const { sendMessage, allMessages } = useMessaging();
  const [activeTab, setActiveTab] = useState<'primary' | 'general' | 'nexus'>('primary');
  const [connections, setConnections] = useState<DbUser[]>([]);
  const [activeContact, setActiveContact] = useState<DbUser | (DbUser & { userId?: string }) | null>(null);
  const [inputText, setInputText] = useState('');
  const [activeCallMode, setActiveCallMode] = useState<'audio' | 'video' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getRoomId = (u1: string, u2: string) => [u1, u2].sort().join('-');

  useEffect(() => {
    async function fetchConnections() {
      try {
        const res = await fetch('/api/connections');
        if (res.ok) {
          const data = await res.json();
          setConnections(data.connections || []);
          if (data.connections.length > 0) setActiveContact(data.connections[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchConnections();
  }, []);



  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [allMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeContact) return;
    const contactId = 'userId' in activeContact ? (activeContact.userId as string) : activeContact.id;
    const roomId = getRoomId(userProfile.id, contactId);
    sendMessage(roomId, inputText);
    setInputText('');
  };

  if (isAppInitializing) return <div className="shimmer" style={{ width: '100%', height: '100vh' }} />;

  return (
    <div className={`nexus-direct-view animate-fade-in ${activeContact ? 'chat-active' : ''}`}>
      {/* Sidebar - Nexus Inbox */}
      <div className="nexus-inbox">
        <div className="nexus-inbox-header">
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
             <h3>{userProfile.username}</h3>
             <ChevronDown size={18} />
           </div>
           <Edit size={22} className="comms-action-icon" />
        </div>
        
        <div className="nexus-inbox-tabs">
           <button className={activeTab === 'primary' ? 'active' : ''} onClick={() => setActiveTab('primary')}>Primary</button>
           <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>General</button>
           <button className={activeTab === 'nexus' ? 'active' : ''} onClick={() => setActiveTab('nexus')}>Requests</button>
        </div>

        <div className="nexus-inbox-list">
          {connections.map(c => (
            <div 
              key={c.id} 
              className={`nexus-item ${activeContact?.id === c.id ? 'active' : ''}`} 
              onClick={() => setActiveContact(c)}
            >
              <Avatar initials={c.initials} color={c.color} size="sm" isSquircle={true} />
              <div className="inbox-item-meta">
                <div style={{ fontWeight: 800, fontSize: '15px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Connected in Orbit</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nexus Comms Area */}
      <div className="nexus-comms-main">
        {activeContact ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="comms-header">
               <div className="comms-meta">
                 <button className="back-to-inbox-btn" onClick={() => setActiveContact(null)}>
                   <ChevronLeft size={28} color="var(--text-primary)" />
                 </button>
                 <Avatar initials={activeContact.initials} color={activeContact.color} size="md" isSquircle={true} />
                 <div>
                   <h4 style={{ fontWeight: 900 }}>{activeContact.name}</h4>
                   <span style={{ fontSize: '11px', color: 'var(--accent-tertiary)', fontWeight: 800 }}>STABLE FREQUENCY</span>
                 </div>
               </div>
               <div style={{ display: 'flex', gap: '20px' }}>
                 <button className="comms-action-icon" style={{ background: 'none', border: 'none' }} onClick={() => setActiveCallMode('audio')}><Phone size={22} /></button>
                 <button className="comms-action-icon" style={{ background: 'none', border: 'none' }} onClick={() => setActiveCallMode('video')}><Video size={22} /></button>
                 <button className="comms-action-icon" style={{ background: 'none', border: 'none' }}><Info size={22} /></button>
               </div>
            </header>

            <div className="comms-stream" ref={scrollRef}>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ margin: '0 auto 20px', width: 'max-content' }}>
                  <Avatar initials={activeContact.initials} color={activeContact.color} size="xl" isSquircle={true} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 900 }}>{activeContact.name}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{activeContact.username} • Skillogram Skiller</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                   <Button size="sm" variant="primary">View Nexus</Button>
                   <Button size="sm" variant="secondary">Restrict</Button>
                </div>
              </div>

              {allMessages[getRoomId(userProfile.id, 'userId' in activeContact ? (activeContact.userId as string) : activeContact.id)]?.map(msg => (
                <div key={msg.id} className={`nebula-msg ${msg.sender === userProfile.username ? 'sent' : 'received'}`}>
                  {msg.type === 'voice' ? (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Play size={16} fill="white" /> <span>Nexus Audio Flux</span></div>
                  ) : (
                    <div>{msg.text}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="comms-input-area">
               <div className="nebula-input-wrapper">
                 <button className="comms-action-icon" style={{ background: 'none', border: 'none' }}><Mic size={22} /></button>
                 <Input 
                   type="text" 
                   placeholder="Enter Nebula flux..." 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 />
                 <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                   {inputText ? (
                     <button style={{ color: 'var(--accent-secondary)', fontWeight: 900, background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleSend}>PULSE</button>
                   ) : (
                     <>
                       <button className="comms-action-icon" style={{ background: 'none', border: 'none' }}><ImageIcon size={22} /></button>
                       <button className="comms-action-icon" style={{ background: 'none', border: 'none' }}><Heart size={22} /></button>
                       <button className="comms-action-icon" style={{ background: 'none', border: 'none' }}><Sparkles size={22} /></button>
                     </>
                   )}
                 </div>
               </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
             <div style={{ width: '100px', height: '100px', borderRadius: '32px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
               <MessageSquare size={40} color="var(--accent-primary)" />
             </div>
             <h2 style={{ fontSize: '28px', fontWeight: 900 }}>Nexus Direct</h2>
             <p style={{ color: 'var(--text-muted)' }}>Initialize a skill exchange via secure direct frequency.</p>
             <button className="btn-nebula" style={{ marginTop: '20px' }}>Initialize Channel</button>
          </div>
        )}
      </div>

      {activeContact && (
        <CallOverlay 
          isOpen={activeCallMode !== null} 
          onClose={() => setActiveCallMode(null)} 
          contactName={activeContact.name} 
          isVideoCall={activeCallMode === 'video'} 
        />
      )}
    </div>
  );
}
