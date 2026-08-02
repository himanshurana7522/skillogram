'use client';
import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Zap, Share2 } from 'lucide-react';
import { DbPost } from '@/lib/db';
import Image from 'next/image';
import { useNotification } from '@/context/NotificationContext';
import './social.css';

interface PostCardProps {
  post: DbPost;
  onCommentClick: (id: string) => void;
}

export function PostCard({ post, onCommentClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotification();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.authorName}`,
          text: post.caption,
          url: `${window.location.origin}/post/${post.id}`
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      addNotification({ type: 'success', title: 'Link Copied', message: 'Post link copied to clipboard.' });
    }
  };

  const handleBookmark = async () => {
    if (isSaving) return;
    setIsSaving(true);
    // Optimistic UI
    setIsSaved(!isSaved);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      });
      if (!res.ok) {
        throw new Error('Failed to save bookmark');
      }
      const data = await res.json();
      setIsSaved(data.bookmarked);
      addNotification({ 
        type: data.bookmarked ? 'success' : 'system', 
        title: data.bookmarked ? 'Saved' : 'Unsaved', 
        message: data.bookmarked ? 'Post added to bookmarks.' : 'Post removed from bookmarks.' 
      });
    } catch (e) {
      console.error(e);
      // Revert optimistic update
      setIsSaved(isSaved);
      addNotification({ type: 'error', title: 'Error', message: 'Failed to save bookmark.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="stellar-post animate-fade-in">
      <header className="stellar-post-header">
        <div className="post-author">
           <div className="author-avatar-glow">
             <div className="avatar-inner">{post.authorName.charAt(0)}</div>
           </div>
           <div className="author-meta">
             <span className="author-name">{post.authorName}</span>
             {post.location && <span className="post-location">{post.location}</span>}
           </div>
        </div>
            <div className="skill-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} fill="currentColor" /> {(post as DbPost & { skillType?: string }).skillType || 'Expert'}</div>
        <button className="stellar-more-btn" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><MoreHorizontal size={20} /></button>
      </header>

      <div className="stellar-post-media">
        {post.type === 'image' ? (
          <Image src={post.mediaUrls[0]} alt="post" fill style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <div className="post-media-placeholder" style={{ background: post.mediaUrls[0] || 'var(--bg-secondary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {post.type === 'carousel' && <div className="carousel-index">1/{post.mediaUrls.length}</div>}
            {!post.mediaUrls[0] && <Zap size={48} color="var(--glass-border)" />}
          </div>
        )}
      </div>

      <div className="stellar-post-actions">
        <div className="actions-left">
          <button 
            onClick={() => setIsLiked(!isLiked)} 
            className={`action-btn ${isLiked ? 'liked glow-primary' : ''}`}
            style={{ 
              background: isLiked ? 'var(--accent-primary)' : 'var(--glass-highlight)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <Heart size={20} fill={isLiked ? 'white' : 'none'} color={isLiked ? 'white' : 'white'} className={isLiked ? 'animate-pop' : ''} />
          </button>
          <button onClick={() => onCommentClick(post.id)} className="action-btn"><MessageCircle size={20} /></button>
          <button onClick={handleShare} className="action-btn"><Share2 size={20} /></button>
        </div>
        <button 
          onClick={handleBookmark} 
          disabled={isSaving}
          className={`action-btn ${isSaved ? 'saved' : ''}`}
          style={{ background: isSaved ? 'var(--accent-secondary)' : 'var(--glass-highlight)', opacity: isSaving ? 0.7 : 1 }}
        >
          <Bookmark size={20} fill={isSaved ? 'white' : 'none'} />
        </button>
      </div>

      <div className="post-content-area">
        <span className="stats-text">{post.likes + (isLiked ? 1 : 0)} skillers engaged</span>
        <div className="stellar-caption">
          <b>{post.authorName}</b> {post.caption}
        </div>
        
        <div className="post-footer-flex">
          <span className="post-timestamp">{post.createdAt}</span>
          <span className="skill-indicator">#SkillogramEvolution</span>
        </div>
      </div>
    </article>
  );
}
