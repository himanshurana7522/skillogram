'use client';
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Zap } from 'lucide-react';
import { CommentsModal } from '@/components/CommentsModal';
import { StoryBar } from '@/components/social/StoryBar';
import { PostCard } from '@/components/social/PostCard';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DbPost } from '@/lib/db';
import './page.css';

function PulseSkeleton() {
  return (
    <div className="pulse-card">
      <div className="skeleton-media shimmer" />
      <div className="pulse-meta">
        <div className="line-item shimmer short" />
        <div className="line-item shimmer long" />
      </div>
    </div>
  );
}

export default function Home() {
  const { reels } = useAppContext();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<'pulse' | 'sphere'>('sphere');
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  
  const [activeCommentsId, setActiveCommentsId] = useState<string | number | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (activeView === 'sphere' && user) {
      async function fetchPosts() {
        setIsPostsLoading(true);
        try {
          const res = await fetch('/api/social/posts');
          if (res.ok) {
            const data = await res.json();
            setPosts(data.posts || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsPostsLoading(false);
        }
      }
      fetchPosts();
    }
  }, [activeView, user]);

  return (
    <div className="main-feed-container">
      {/* Skillogram View Toggle */}
      <div className="feed-header-tabs">
        <div className="tabs-inner">
          <button 
            className={`tab-btn ${activeView === 'sphere' ? 'active' : ''}`}
            onClick={() => setActiveView('sphere')}
          >
            Sphere
          </button>
          <button 
            className={`tab-btn ${activeView === 'pulse' ? 'active' : ''}`}
            onClick={() => setActiveView('pulse')}
          >
            Pulse
          </button>
        </div>
      </div>

      <div className="feed-content-scroller">
        {activeView === 'sphere' ? (
          /* SPHERE VIEW (Social Feed) */
          <div className="skillogram-feed-layout">
            <StoryBar />
            <div className="posts-list">
              {isPostsLoading ? (
                [1, 2].map(i => <div key={i} className="post-skeleton shimmer" />)
              ) : (
                posts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onCommentClick={(id) => setActiveCommentsId(id)} 
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          /* PULSE VIEW (Showcases/Reels) */
          <div className="pulse-feed-layout">
             {reels.map(reel => (
                <div key={reel.id} className="pulse-card animate-fade-in">
                  <div className="pulse-media-container" style={{ background: `linear-gradient(135deg, ${reel.color}22, #000)` }}>
                    <div className="pulse-top-meta">
                      <span className="skill-tag">{reel.skill}</span>
                    </div>
                    <div className="pulse-sidebar">
                       <button className="pulse-action-btn"><Heart size={24} /><span>1.2K</span></button>
                       <button className="pulse-action-btn" onClick={() => setActiveCommentsId(reel.id)}><MessageCircle size={24} /><span>84</span></button>
                       <button className="pulse-action-btn"><Share2 size={24} /></button>
                       <button className="pulse-action-btn"><MoreHorizontal size={20} /></button>
                    </div>
                    <div className="pulse-bottom-info">
                       <h3>{reel.author}</h3>
                       <p>{reel.title}</p>
                    </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>

      <CommentsModal
        isOpen={activeCommentsId !== null}
        onClose={() => setActiveCommentsId(null)}
        reelId={typeof activeCommentsId === 'number' ? activeCommentsId : null}
      />
    </div>
  );
}
