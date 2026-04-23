import React, { useState } from 'react';
import { Video, Mic, Globe } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import './NewRoomModal.css';

interface NewRoomModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export function NewRoomModal({ onClose, isOpen }: NewRoomModalProps) {
  const { addRoom } = useAppContext();
  const [roomType, setRoomType] = useState<'video' | 'audio'>('video');
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      addRoom(topic, roomType);
      setTopic(''); // reset
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-room animate-bounce" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Room</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Topic or Skill</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Advanced Frontend Architecture" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <div className="room-type-options">
              <div 
                className={`type-option ${roomType === 'video' ? 'selected' : ''}`}
                onClick={() => setRoomType('video')}
              >
                <Video size={24} />
                <span>Video & Screen</span>
              </div>
              <div 
                className={`type-option ${roomType === 'audio' ? 'selected' : ''}`}
                onClick={() => setRoomType('audio')}
              >
                <Mic size={24} />
                <span>Audio Only</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Privacy</label>
            <div className="form-input" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--text-muted)" />
              <select 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-main)', 
                  outline: 'none',
                  flex: 1,
                  fontFamily: 'inherit'
                }}
              >
                <option value="public">Public - Anyone can join</option>
                <option value="private">Private - Invite only</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-neon create">Start Room</button>
          </div>
        </form>
      </div>
    </div>
  );
}
