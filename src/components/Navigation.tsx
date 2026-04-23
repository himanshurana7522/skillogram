'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NewRoomModal } from './NewRoomModal';
import { PulseCreator } from './social/PulseCreator';
import { Home, Compass, User, MessageCircle, Video, Search, Bell, X, PlusSquare, Plus, Menu, LayoutGrid, Heart, Film } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import './Navigation.css';

export function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPulseCreatorOpen, setIsPulseCreatorOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { unreadCount, notifications, markNotificationsAsRead } = useAppContext();
  const pathname = usePathname();

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      markNotificationsAsRead();
    }
  };

  const navItems = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Search', icon: Search, href: '/search' },
    { title: 'Reels', icon: Film, href: '/reels' },
    { title: 'Discovery', icon: Compass, href: '/match' },
    { title: 'Communities', icon: LayoutGrid, href: '/communities' },
    { title: 'Workshops', icon: Video, href: '/rooms' },
    { title: 'Messages', icon: MessageCircle, href: '/chat' },
    { title: 'Activity', icon: Heart, type: 'action', onClick: handleBellClick },
    { title: 'Create', icon: PlusSquare, type: 'action', onClick: () => setIsPulseCreatorOpen(true) },
    { title: 'Portfolio', icon: User, href: '/profile', className: 'profile-link' }
  ];

  return (
    <>
      {/* Stellar Floating Sidebar (Desktop) */}
      <nav className="stellar-sidebar glass-pane desktop-only">
        <div className="sidebar-logo-glow">
          <Link href="/">
             <h1 className="stellar-logo-text text-gradient">Skillogram<span>.</span></h1>
          </Link>
        </div>
        
        <ul className="stellar-nav-links">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.href ? (
                <Link 
                  href={item.href} 
                  className={`stellar-nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <item.icon size={22} strokeWidth={pathname === item.href ? 2.5 : 2} /> 
                  <span>{item.title}</span>
                </Link>
              ) : (
                <div 
                  className={`stellar-nav-item ${item.title === 'Activity' ? 'activity-anchor' : ''}`} 
                  onClick={item.onClick}
                >
                  <item.icon size={22} /> 
                  <span>{item.title}</span>
                  {item.title === 'Activity' && unreadCount > 0 && <div className="stellar-dot" />}
                </div>
              )}
            </li>
          ))}
        </ul>
        
        <div className="sidebar-footer">
          <button className="stellar-nav-item more-btn"><Menu size={22} /> <span>Extras</span></button>
        </div>

        {/* Floating Notifications Flyout */}
        {showDropdown && (
          <div className="stellar-flyout glass-pane animate-fade-in">
             <div className="flyout-header">
               <h2>Recent Activity</h2>
             </div>
             <div className="flyout-content">
               {notifications.length === 0 ? (
                 <p className="empty-msg">Clear skies! No new activity.</p>
               ) : (
                 notifications.map(n => (
                   <div key={n.id} className="stellar-notification-item">
                     <div className="notif-avatar glow-blue">{n.title.charAt(0)}</div>
                     <div className="notif-text">
                       <p><b>{n.title}</b> {n.message}</p>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        )}
      </nav>

      {/* Stellar Top Bar (Mobile) */}
      <nav className="stellar-top-bar mobile-only glass-pane">
        <h1 className="stellar-logo-text text-gradient">Skillogram<span>.</span></h1>
        <div className="bar-actions">
           <div className="action-circle" onClick={handleBellClick}>
              <Heart size={20} />
              {unreadCount > 0 && <div className="stellar-dot" style={{ position: 'absolute', top: '10px', right: '8px' }} />}
           </div>
           <Link href="/chat" className="action-circle"><MessageCircle size={20} /></Link>
           <div className="action-circle" onClick={() => setShowMobileMenu(true)}>
             <Menu size={20} />
           </div>
        </div>
      </nav>

      {/* Mobile Extras Menu Drawer */}
      {showMobileMenu && (
        <div className="mobile-hamburger-nav mobile-only">
           <button 
             onClick={() => setShowMobileMenu(false)} 
             className="cam-icon-btn" 
             style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)' }}
           >
             <X size={28} />
           </button>
           
           <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '30px', paddingLeft: '24px' }}>Explore Nebula</h2>
           
           <Link href="/communities" className="hamburger-link" onClick={() => setShowMobileMenu(false)}>
             <LayoutGrid size={28} color="var(--accent-primary)" /> <span>Communities</span>
           </Link>
           <Link href="/rooms" className="hamburger-link" onClick={() => setShowMobileMenu(false)}>
             <Video size={28} color="var(--accent-secondary)" /> <span>Live Workshops</span>
           </Link>
           <div className="hamburger-link" onClick={() => { setShowMobileMenu(false); alert("Settings Module Opening..."); }}>
             <User size={28} color="var(--accent-tertiary)" /> <span>Preferences</span>
           </div>
        </div>
      )}

      {/* Stellar Floating Dock (Mobile) */}
      <nav className="stellar-dock glass-pane mobile-only">
        <Link href="/" className={`dock-item ${pathname === '/' ? 'active' : ''}`}><Home size={24} /></Link>
        <Link href="/search" className={`dock-item ${pathname === '/search' ? 'active' : ''}`}><Search size={24} /></Link>
        <div className="dock-item create-btn" onClick={() => setIsPulseCreatorOpen(true)}><Plus size={28} /></div>
        <Link href="/reels" className={`dock-item ${pathname === '/reels' ? 'active' : ''}`}><Film size={24} /></Link>
        <Link href="/profile" className={`dock-item ${pathname === '/profile' ? 'active' : ''}`}><User size={24} /></Link>
      </nav>

      <NewRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PulseCreator isOpen={isPulseCreatorOpen} onClose={() => setIsPulseCreatorOpen(false)} />
    </>
  );
}
