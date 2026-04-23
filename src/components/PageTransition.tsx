'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (pathname !== undefined) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsAnimating(false);
      }, 300); // Pulse duration
      return () => clearTimeout(timer);
    }
  }, [pathname, children]);

  return (
    <div className={`nebula-transition-wrapper ${isAnimating ? 'exit' : 'enter'}`}>
      <style jsx global>{`
        .nebula-transition-wrapper {
          transition: opacity 0.3s ease, transform 0.3s ease;
          width: 100%;
          min-height: 100vh;
        }
        .nebula-transition-wrapper.enter {
          opacity: 1;
          transform: translateY(0);
        }
        .nebula-transition-wrapper.exit {
          opacity: 0;
          transform: translateY(10px);
        }
      `}</style>
      {displayChildren}
    </div>
  );
}
