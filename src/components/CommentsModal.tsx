'use client';
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Send } from 'lucide-react';
import './FeedModals.css';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: number | null;
}

export function CommentsModal({ isOpen, onClose, reelId }: CommentsModalProps) {
  const { userProfile } = useAppContext();
  const [comments, setComments] = useState<{ id: number; author: string; text: string }[]>([
    { id: 1, author: 'Sanya Design', text: 'This changed my workflow entirely! 🔥' },
    { id: 2, author: 'DevGuy99', text: 'Where can I find the source code?' },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setComments(prev => [...prev, { id: Date.now(), author: userProfile.name, text: input }]);
    setInput('');
  };

  return (
    <div className="slide-up-overlay" onClick={onClose}>
      <div className="slide-up-modal" style={{ height: '60vh' }} onClick={e => e.stopPropagation()}>
        <div className="modal-drag-handle" />
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Comments</h3>
        
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar" style={{ backgroundColor: `hsl(${c.id * 50}, 70%, 50%)` }}>
                {c.author.charAt(0)}
              </div>
              <div className="comment-content">
                <h4>{c.author}</h4>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="comment-input-area" onSubmit={handlePost}>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={input}
            onChange={(e) => setInput(e.target.value)} 
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}
