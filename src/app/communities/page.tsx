'use client';
import React, { useEffect, useState } from 'react';
import { Users, Presentation, Shield, Code, Brush, LayoutGrid, ArrowRight } from 'lucide-react';
import './communities.css';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/context/NotificationContext';

interface CommunityData {
  _id: string;
  name: string;
  description: string;
  members: string[];
  activeCount: number;
  color: string;
  icon: string;
}

const IconMap: Record<string, React.ElementType> = {
  LayoutGrid: LayoutGrid,
  Code: Code,
  Brush: Brush,
  Shield: Shield
};

export default function Communities() {
  const { isInitializing } = useUser();
  const { addNotification } = useNotification();
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const res = await fetch('/api/communities');
        if (res.ok) {
          const data = await res.json();
          setCommunities(data.communities);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCommunities();
  }, []);

  const handleNotImplemented = (featureName: string) => {
    addNotification({
      type: 'system',
      title: 'Action Triggered',
      message: `${featureName} is disabled in this environment.`
    });
  };

  if (isInitializing || isLoading) {
    return <div className="communities-wrapper shimmer" style={{ height: '100vh', borderRadius: '20px' }} />;
  }

  return (
    <div className="communities-wrapper animate-fade-in">
      <header className="communities-header">
        <h1>Professional Communities</h1>
        <p>Join highly specialized skill groups to level up your craft and expand your orbital network.</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
          <Button onClick={() => handleNotImplemented("Discovery Algorithm")}>Discover Groups</Button>
          <Button variant="secondary" onClick={() => handleNotImplemented("Saved Networks")}>Your Networks</Button>
        </div>
      </header>

      <div className="community-grid">
        {communities.map(comm => {
          const IconComponent = IconMap[comm.icon] || Users;
          return (
            <div key={comm._id} className="community-card glass-pane" onClick={() => handleNotImplemented(`Join ${comm.name}`)}>
              <div className="community-banner" style={{ background: `linear-gradient(135deg, ${comm.color}, #08080C)` }}>
                <div className="community-banner-overlay" />
                <div className="community-icon-container" style={{ background: comm.color }}>
                  <IconComponent size={32} color="white" />
                </div>
              </div>
              
              <div className="community-content">
                <h3>{comm.name}</h3>
                <p>{comm.description}</p>
              </div>
              
              <div className="community-meta">
                <div className="meta-item">
                  <Users size={16} /> <span>{comm.members.length.toLocaleString()} Skillers</span>
                </div>
                <div className="meta-item" style={{ color: 'var(--accent-tertiary)' }}>
                  <Presentation size={16} /> <span>{comm.activeCount} Live</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                   <ArrowRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
