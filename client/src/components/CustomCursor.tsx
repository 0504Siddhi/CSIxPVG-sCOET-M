'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0)`;
      }

      // Add trail element occasionally to avoid clogging React state
      if (Math.random() < 0.25) {
        const id = trailId.current++;
        setTrail((prev) => [...prev.slice(-15), { x, y, id }]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (trail.length === 0) return;
    const timer = setTimeout(() => {
      setTrail((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [trail]);

  return (
    <>
      {/* Tiny cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out shadow-[0_0_8px_#00f0ff]"
      />
      {/* Outer cursor ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 border border-cyan-400/40 rounded-full pointer-events-none z-[9998] transition-transform duration-300 ease-out"
      />
      {/* Particle mouse trail */}
      {trail.map((pt) => (
        <div
          key={pt.id}
          className="fixed top-0 left-0 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-[9997] animate-ping opacity-60"
          style={{
            transform: `translate3d(${pt.x - 3}px, ${pt.y - 3}px, 0)`,
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}
        />
      ))}
    </>
  );
}
