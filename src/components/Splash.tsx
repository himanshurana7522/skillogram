'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import './Splash.css';

export function Splash() {
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!show || pathname === '/login') return null;

  return (
    <div className={`splash-container ${!show ? 'hide' : ''}`}>
      <div className="splash-logo animate-bounce animate-glow">
        <div className="inner-glow"></div>
      </div>
      <h1 className="splash-text">Skillogram</h1>
    </div>
  );
}
