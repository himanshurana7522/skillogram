'use client';
import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, User, Shield, Lock, Bell, Eye, Heart, 
  DollarSign, Activity, ShieldCheck, Moon, Key, Users, MessageSquare, 
  Tag, Clock, UserX, AlertTriangle, Monitor, Info, Star, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './settings.css';

interface SettingsHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsHub({ isOpen, onClose }: SettingsHubProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { signOut } = useAuth();

  if (!isOpen) return null;

  const renderNavArrow = () => <ChevronRight size={20} color="var(--text-muted)" />;

  return (
    <div className="settings-hub-container animate-fade-in" style={{ zIndex: 7000 }}>
      {/* Header */}
      <nav className="settings-nav" style={{ padding: '20px 0', borderBottom: '1px solid var(--glass-border)' }}>
        <button className="back-btn" onClick={activeCategory ? () => setActiveCategory(null) : onClose} style={{ marginLeft: '10px' }}>
          <ChevronLeft size={28} />
        </button>
        <h3 style={{ textTransform: 'capitalize', fontWeight: 800, fontSize: '18px' }}>
          {activeCategory ? activeCategory.replace('-', ' ') : 'Settings and activity'}
        </h3>
        <div style={{ width: '40px' }} /> {/* alignment spacer */}
      </nav>

      <div className="settings-list" style={{ overflowY: 'auto', flex: 1, padding: '20px 0' }}>
        {!activeCategory ? (
          <>
            {/* Account Center Mock */}
            <div className="account-center-mockup">
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <Shield size={28} color="var(--accent-primary)" />
                  <div>
                     <h4 style={{ fontWeight: 800, fontSize: '16px' }}>Nexus Account Center</h4>
                     <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Password, security, personal details</p>
                  </div>
               </div>
               <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Manage your connected experiences and account settings across Skillogram.
               </p>
            </div>

            {/* How you use Skillogram */}
            <div className="settings-group">
              <div className="group-header">How you use Skillogram</div>
              <SettingsRow icon={<BookmarkIcon />} title="Saved" subtitle="Pulses and Audio" onClick={() => setActiveCategory('saved')} navArrow={renderNavArrow} />
              <SettingsRow icon={<Clock size={22} color="var(--text-primary)" />} title="Time spent" onClick={() => setActiveCategory('time-spent')} navArrow={renderNavArrow} />
            </div>

            {/* What you see */}
            <div className="settings-group">
              <div className="group-header">What you see</div>
              <SettingsRow icon={<Star size={22} color="var(--text-primary)" />} title="Favorites" onClick={() => setActiveCategory('favorites')} navArrow={renderNavArrow} />
              <SettingsRow icon={<Eye size={22} color="var(--text-primary)" />} title="Muted accounts" onClick={() => setActiveCategory('muted')} navArrow={renderNavArrow} />
              <SettingsRow icon={<Monitor size={22} color="var(--text-primary)" />} title="Content preferences" subtitle="Ads, Discover tuning" onClick={() => setActiveCategory('content')} navArrow={renderNavArrow} />
            </div>

            {/* Who can see your content */}
            <div className="settings-group">
              <div className="group-header">Who can see your content</div>
              <SettingsRow icon={<Lock size={22} color="var(--text-primary)" />} title="Account privacy" subtitle="Public" onClick={() => setActiveCategory('privacy')} navArrow={renderNavArrow} />
              <SettingsRow icon={<Users size={22} color="var(--text-primary)" />} title="Close Friends" subtitle="0 people" onClick={() => setActiveCategory('close-friends')} navArrow={renderNavArrow} />
              <SettingsRow icon={<UserX size={22} color="var(--text-primary)" />} title="Blocked" onClick={() => setActiveCategory('blocked')} navArrow={renderNavArrow} />
            </div>

            {/* How others can interact with you */}
            <div className="settings-group">
              <div className="group-header">How others interact with you</div>
              <SettingsRow icon={<MessageSquare size={22} color="var(--text-primary)" />} title="Messages and story replies" onClick={() => setActiveCategory('messages')} navArrow={renderNavArrow} />
              <SettingsRow icon={<Tag size={22} color="var(--text-primary)" />} title="Tags and mentions" onClick={() => setActiveCategory('tags')} navArrow={renderNavArrow} />
              <SettingsRow icon={<AlertTriangle size={22} color="var(--error)" />} title="Hidden words" onClick={() => setActiveCategory('hidden-words')} navArrow={renderNavArrow} />
            </div>

            {/* Professional & More */}
            <div className="settings-group">
              <div className="group-header">For Professionals</div>
              <SettingsRow icon={<Activity size={22} color="var(--text-primary)" />} title="Creator tools and controls" onClick={() => setActiveCategory('creator')} navArrow={renderNavArrow} />
              <SettingsRow icon={<ShieldCheck size={22} color="var(--accent-secondary)" />} title="Skill Verification" subtitle="Request Review" onClick={() => setActiveCategory('verify')} navArrow={renderNavArrow} />
            </div>

            <div className="settings-group">
              <div className="group-header">More info and support</div>
              <SettingsRow icon={<Info size={22} color="var(--text-primary)" />} title="Help" onClick={() => setActiveCategory('help')} navArrow={renderNavArrow} />
              <SettingsRow icon={<User size={22} color="var(--text-primary)" />} title="Account Status" onClick={() => setActiveCategory('status')} navArrow={renderNavArrow} />
            </div>

            <div className="settings-group">
              <div className="group-header">Login</div>
              <SettingsRow 
                icon={<LogOut size={22} color="#f43f5e" />} 
                title="Log out" 
                titleStyle={{ color: '#f43f5e' }}
                onClick={() => {
                  signOut();
                  onClose();
                }} 
              />
            </div>

            <div style={{ padding: '20px 30px', textAlign: 'center' }}>
               <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 800 }}>Skillogram Nebula Platform OS</span>
            </div>
          </>
        ) : (
          <div className="category-detail animate-fade-in" style={{ padding: '20px' }}>
             {/* Dynamic Sub-pages Placeholder */}
             <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Shield size={48} color="var(--accent-primary)" style={{ opacity: 0.3, marginBottom: '20px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>{activeCategory.replace('-', ' ')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>This specific section is under maintenance as part of the Nebula upgrade.</p>
                <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={() => setActiveCategory(null)}>Return</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsRow({ icon, title, subtitle, onClick, navArrow, titleStyle }: any) {
  return (
    <div className="settings-item" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
         <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
         <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', ...titleStyle }}>{title}</span>
            {subtitle && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</span>}
         </div>
      </div>
      {navArrow && navArrow()}
    </div>
  );
}

function BookmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
