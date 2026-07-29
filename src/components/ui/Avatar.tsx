import React from 'react';
import './Avatar.css';

interface AvatarProps {
  initials?: string;
  imageUrl?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSquircle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  imageUrl,
  color = 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
  size = 'md',
  isSquircle = false,
  className = '',
  onClick,
}) => {
  const sizeClass = `avatar-${size}`;
  const shapeClass = isSquircle ? 'avatar-squircle' : 'avatar-circle';

  return (
    <div
      className={`skillogram-avatar ${sizeClass} ${shapeClass} ${className}`}
      style={{ background: imageUrl ? `url(${imageUrl}) center/cover` : color }}
      onClick={onClick}
    >
      {!imageUrl && initials && <span>{initials}</span>}
    </div>
  );
};
