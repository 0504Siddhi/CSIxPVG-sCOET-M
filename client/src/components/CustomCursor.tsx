'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide standard cursor on desktops
    if (window.matchMedia('(pointer: fine)').matches) {
      document.body.style.cursor = 'none';
      
      const elements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer');
      elements.forEach(el => {
        (el as HTMLElement).style.cursor = 'none';
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Simple, clean cursor dot (non-neon) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-neutral-300 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{ mixBlendMode: 'difference' }}
      />
      {/* Simple, clean outer ring (non-neon) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-neutral-400/40 rounded-full pointer-events-none z-[9998] transition-transform duration-300 ease-out"
        style={{ mixBlendMode: 'difference' }}
      />
    </>
  );
}
