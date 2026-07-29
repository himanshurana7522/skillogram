'use client';
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EditProfileModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export function EditProfileModal({ onClose, isOpen }: EditProfileModalProps) {
  const { userProfile, updateUserProfile } = useUser();
  
  const [name, setName] = useState(userProfile.name);
  const [username, setUsername] = useState(userProfile.username);
  const [bio, setBio] = useState(userProfile.bio);
  const [teaching, setTeaching] = useState(userProfile.teachingSkills.join(', '));
  const [learning, setLearning] = useState(userProfile.learningSkills.join(', '));

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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Edit Nexus">
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Bio</label>
          <textarea 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            required 
            placeholder="Your Skillogram mission..."
            style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '14px 20px', color: 'white', minHeight: '100px', outline: 'none' }}
          />
        </div>

        <Input label="Expertise (comma separated)" value={teaching} onChange={e => setTeaching(e.target.value)} />
        <Input label="Quest (comma separated)" value={learning} onChange={e => setLearning(e.target.value)} />

        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <div style={{ flex: 1 }}><Button type="button" variant="secondary" fullWidth onClick={onClose}>Abort</Button></div>
          <div style={{ flex: 2 }}><Button type="submit" variant="primary" fullWidth>Save to Nexus</Button></div>
        </div>
      </form>
    </BottomSheet>
  );
}
