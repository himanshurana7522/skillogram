import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'highlight';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const clickableClass = onClick ? 'card-clickable' : '';
  const variantClass = `card-${variant}`;

  return (
    <div className={`skillogram-card ${variantClass} ${clickableClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
