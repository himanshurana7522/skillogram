'use client';
import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Zap, Share2 } from 'lucide-react';
import { DbPost } from '@/lib/db';
import './social.css';

interface PostCardProps {
  post: DbPost;
  onCommentClick: (id: string) => void;
}

export function PostCard({ post, onCommentClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
            <div className="skill-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} fill="currentColor" /> {(post as any).skillType || 'Expert'}</div>
        <button className="stellar-more-btn" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><MoreHorizontal size={20} /></button>
      </header>

      <div className="stellar-post-media">
        {post.type === 'image' ? (
          <img src={post.mediaUrls[0]} alt="post" />
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
          <button className="action-btn"><Share2 size={20} /></button>
        </div>
        <button 
          onClick={() => setIsSaved(!isSaved)} 
          className={`action-btn ${isSaved ? 'saved' : ''}`}
          style={{ background: isSaved ? 'var(--accent-secondary)' : 'var(--glass-highlight)' }}
        >
          <Bookmark size={20} fill={isSaved ? 'white' : 'none'} />
        </button>
      </div>

      <div className="post-content-area">
        <span className="stats-text">{post.likes.length + (isLiked ? 1 : 0)} skillers engaged</span>
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
