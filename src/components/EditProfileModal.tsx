'use client';
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import './EditProfileModal.css';

interface EditProfileModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export function EditProfileModal({ onClose, isOpen }: EditProfileModalProps) {
  const { userProfile, updateUserProfile } = useAppContext();
  
  const [name, setName] = useState(userProfile.name);
  const [username, setUsername] = useState(userProfile.username);
  const [bio, setBio] = useState(userProfile.bio);
  const [teaching, setTeaching] = useState(userProfile.teachingSkills.join(', '));
  const [learning, setLearning] = useState(userProfile.learningSkills.join(', '));

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      username,
      bio,
      teachingSkills: teaching.split(',').map(s => s.trim()).filter(Boolean),
      learningSkills: learning.split(',').map(s => s.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-pane animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-gradient">Edit Nexus</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="edit-profile-form" onSubmit={handleSave}>
          <div className="edit-split">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} required placeholder="Your Skillogram mission..."/>
          </div>

          <div className="form-group">
            <label>Expertise (comma separated)</label>
            <input type="text" className="form-input" value={teaching} onChange={e => setTeaching(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Quest (comma separated)</label>
            <input type="text" className="form-input" value={learning} onChange={e => setLearning(e.target.value)} />
          </div>

          <div className="modal-actions" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Abort</button>
            <button type="submit" className="btn-nebula" style={{ flex: 2 }}>Save to Nexus</button>
          </div>
        </form>
      </div>
    </div>
  );
}
