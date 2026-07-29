import React, { useEffect } from 'react';
import './BottomSheet.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="bottom-sheet-overlay animate-fade-in" onClick={onClose} />
      <div className="bottom-sheet-content animate-slide-up">
        <div className="bottom-sheet-handle-wrapper" onClick={onClose}>
          <div className="bottom-sheet-handle" />
        </div>
        {title && <h2 className="bottom-sheet-title">{title}</h2>}
        <div className="bottom-sheet-body">
          {children}
        </div>
      </div>
    </>
  );
};
