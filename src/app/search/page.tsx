'use client';
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Heart, MessageCircle, Play, Sparkles } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import './search.css';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreItems, setExploreItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<{users: any[], rooms: any[]} | null>(null);

  useEffect(() => {
    async function fetchExplore() {
      try {
        const res = await fetch('/api/search');
        if (res.ok) {
          const data = await res.json();
          setExploreItems(data.exploreItems || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExplore();
  }, []);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length > 1) {
      try {
        const res = await fetch(`/api/search?q=${val}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div className="explore-wrapper animate-fade-in">
      <div className="explore-search-section" style={{ flexDirection: 'column', gap: '30px' }}>
        <div className="nebula-search-bar">
          <SearchIcon size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search Quest" 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && <button onClick={() => handleSearch('')}><X size={18} /></button>}
        </div>

        {!searchResults && (
          <div className="trending-chips animate-fade-in" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['AI Engineering', 'Motion Design', 'Cloud Architecture', 'UX Psychology', '3D Modeling', 'FinTech'].map(skill => (
              <button 
                key={skill} 
                className="btn-secondary" 
                style={{ padding: '10px 20px', fontSize: '12px', borderRadius: '12px' }}
                onClick={() => setSearchQuery(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="explore-main-content">
        {searchResults ? (
          <div className="search-results-nebula" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {searchResults.users.map(u => (
               <div key={u.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', cursor: 'pointer' }}>
                 <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{u.name.charAt(0)}</div>
                 <div>
                   <div style={{ fontWeight: 800, fontSize: '17px' }}>{u.username}</div>
                   <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u.name} • {u.teachingSkills[0]}</div>
                 </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="nebula-explore-grid">
            {isLoading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="explore-cell shimmer" />)
            ) : (
              exploreItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`explore-cell ${idx % 7 === 0 ? 'wide' : idx % 10 === 0 ? 'tall' : ''}`}
                >
                  {item.type === 'image' ? (
                    <img src={item.content} alt="explore" />
                  ) : (
                    <div className="explore-placeholder" style={{ background: item.content || 'var(--bg-secondary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.type === 'reel' && <div style={{ color: 'var(--accent-primary)' }}><Play size={32} fill="currentColor" /></div>}
                      {!item.content && <Sparkles size={32} color="var(--glass-highlight)" />}
                    </div>
                  )}
                  <div className="cell-overlay">
                     <div className="cell-stats">
                        <div className="stat-chip"><Heart size={14} fill="white" /> 1.2K</div>
                        <div className="stat-chip"><MessageCircle size={14} fill="white" /> 84</div>
                     </div>
                     <div style={{ fontSize: '10px', fontWeight: 800, background: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '10px' }}>
                        {item.type.toUpperCase()}
                     </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
