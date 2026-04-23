'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Link2, Grid, Video, Bookmark, Tag, Star, ChevronRight, UserPlus, MoreHorizontal, Settings2, LayoutGrid, Award, Zap } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { EditProfileModal } from '@/components/EditProfileModal';
import { SettingsHub } from '@/components/settings/SettingsHub';
import './profile.css';

function ProfileSkeleton() {
  return (
    <div className="skillogram-profile-wrapper">
      <div className="skeleton-header shimmer" style={{ height: '300px', borderRadius: '40px' }} />
      <div className="skeleton-tabs shimmer" style={{ height: '50px', margin: '40px 0' }} />
      <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[1,2,3,4,5,6].map(i => <div key={i} className="shimmer" style={{ height: '200px', borderRadius: '24px' }} />)}
      </div>
    </div>
  );
}

export default function Profile() {
  const { userProfile, isInitializing } = useAppContext();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (showInsights && !insights) {
      async function fetchInsights() {
        try {
          const res = await fetch('/api/creator/insights');
          if (res.ok) {
            const data = await res.json();
            setInsights(data.insights);
          }
        } catch (e) {
          console.error(e);
        }
      }
      fetchInsights();
    }
  }, [showInsights, insights]);

  if (isInitializing || isAuthLoading) return <ProfileSkeleton />;

  return (
    <div className="skillogram-profile-wrapper animate-fade-in">
      {/* Nebula Header */}
      <header className="skillogram-profile-header">
         <div className="profile-avatar-section">
           <div className="skillogram-avatar-large">
             <div className="avatar-inner-box" style={{ background: userProfile.color }}>
                {userProfile.initials || userProfile.name.charAt(0)}
             </div>
             {(userProfile.accountType === 'creator' || userProfile.accountType === 'business') && (
               <div className="skillogram-verified-badge">
                 <Award size={20} color="white" />
               </div>
             )}
           </div>
         </div>

         <div className="profile-info-section">
           <div className="profile-top-bar">
             <h2 className="profile-username">{userProfile.username}</h2>
             <div className="profile-actions">
               <button className="btn-nebula" onClick={() => setShowEditProfile(true)}>Edit Nebula</button>
               <button className="btn-nebula" onClick={() => setShowSettings(true)}><Settings2 size={20} /></button>
             </div>
           </div>

           <div className="profile-stats">
             <div className="stat-card"><b>48</b> <span>Showcases</span></div>
             <div className="stat-card"><b>12.4k</b> <span>Skillers</span></div>
             <div className="stat-card"><b>430</b> <span>Connections</span></div>
           </div>

           <div className="profile-bio">
             <h3>{userProfile.name}</h3>
             <span className="bio-category">Skill Ambassador • {userProfile.teachingSkills[0] || 'Creative'}</span>
             <p className="bio-text">{userProfile.bio}</p>
             <div className="bio-links" style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--accent-secondary)', fontWeight: 600 }}>
               <Link2 size={16} /> <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>skillogram.io/nexus</a>
             </div>
           </div>
         </div>
      </header>

      {/* Professional Achievement Hub */}
      <div className="professional-dashboard-hub" onClick={() => setShowInsights(true)}>
         <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: 'var(--accent-primary)', padding: '12px', borderRadius: '14px' }}>
              <Zap size={24} color="white" />
            </div>
            <div>
              <b style={{ display: 'block', fontSize: '18px' }}>Creator Nexus</b>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Analyze your skill impact and global reach.</span>
            </div>
         </div>
         <ChevronRight size={20} color="var(--text-secondary)" />
      </div>

      {/* Nebula Tabs */}
      <div className="skillogram-tabs">
        <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}><Grid size={18} /> <span>Sphere</span></button>
        <button className={activeTab === 'reels' ? 'active' : ''} onClick={() => setActiveTab('reels')}><Video size={18} /> <span>Pulse</span></button>
        <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}><LayoutGrid size={18} /> <span>Achievements</span></button>
        <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => setActiveTab('saved')}><Bookmark size={18} /> <span>Saved</span></button>
      </div>

      {/* Modular Content Section */}
      <div className="profile-content-stream">
         {activeTab === 'portfolio' ? (
           <div className="achievement-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              <div className="achievement-card">
                 <div className="achievement-icon"><Award size={24} /></div>
                 <div>
                    <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Advanced Skill Exchange</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Verified 10h masterclass in React Architecture.</p>
                 </div>
                 <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--glass-border)', fontSize: '12px', color: 'var(--accent-tertiary)', fontWeight: 800 }}>CERTIFIED AUG 2025</div>
              </div>
              <div className="achievement-card">
                 <div className="achievement-icon"><Zap size={24} /></div>
                 <div>
                    <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Community Catalyst</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Recognized for exceptional mentorship in the UI Circle.</p>
                 </div>
                 <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--glass-border)', fontSize: '12px', color: 'var(--accent-tertiary)', fontWeight: 800 }}>AWARDED MAR 2026</div>
              </div>
           </div>
         ) : (
           <div className="skillogram-mosaic-grid animate-fade-in">
              {[1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className={`mosaic-item ${i % 4 === 0 ? 'wide' : i % 7 === 0 ? 'tall' : ''}`}>
                   <img src={`https://picsum.photos/seed/${i + 120}/600/600`} alt="post" />
                   <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '5px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>
                     {i % 3 === 0 ? 'PULSE' : 'SPHERE'}
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>

      {/* Insights High-Fidelity Overlay */}
      {showInsights && insights && (
        <div className="ig-modal-overlay" onClick={() => setShowInsights(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
           <div className="glass-pane animate-fade-in" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
             <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 900 }}>Nexus Insights</h3>
                <button onClick={() => setShowInsights(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
             </header>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                   <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Account Reach</span>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginTop: '10px' }}>
                      <h4 style={{ fontSize: '32px', fontWeight: 900 }}>{insights.accountsReached}</h4>
                      <small style={{ color: 'var(--accent-tertiary)', fontWeight: 800 }}>+12.4%</small>
                   </div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                   <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Skill Engagement</span>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginTop: '10px' }}>
                      <h4 style={{ fontSize: '32px', fontWeight: 900 }}>{insights.accountsEngaged}</h4>
                      <small style={{ color: 'var(--accent-tertiary)', fontWeight: 800 }}>+8.2%</small>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                   <button className="btn-nebula" style={{ flex: 1 }}>Deep Analysis</button>
                   <button className="btn-nebula" style={{ background: 'none', border: '1px solid var(--glass-border)' }}>Export</button>
                </div>
             </div>
           </div>
        </div>
      )}

      <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <SettingsHub isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
