'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logText, setLogText] = useState('INITIALIZING DIGITAL CORE...');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Percentage counter logic
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Vary the increment speed for faster loading
      let increment = 1;
      if (currentProgress < 35) {
        increment = Math.floor(Math.random() * 8) + 6;
      } else if (currentProgress < 75) {
        increment = Math.floor(Math.random() * 6) + 4;
      } else if (currentProgress < 95) {
        increment = Math.floor(Math.random() * 4) + 2;
      } else {
        increment = 2;
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      // Dynamic log logs based on percentage
      if (currentProgress === 100) {
        setLogText('SYSTEM ONLINE. ACCESS GRANTED.');
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300); // Fast transition after reaching 100%
      } else if (currentProgress > 90) {
        setLogText('PERFORMING FINAL KERNEL CHECKS...');
      } else if (currentProgress > 75) {
        setLogText('OPTIMIZING 3D GRAPHICS LAYERS...');
      } else if (currentProgress > 55) {
        setLogText('CACHING INTERFACE MULTIMEDIA ASSETS...');
      } else if (currentProgress > 35) {
        setLogText('SECURING DECRYPTED API CONNECTIONS...');
      } else if (currentProgress > 15) {
        setLogText('ESTABLISHING SECURE DATABASE LINK...');
      } else {
        setLogText('INITIALIZING DIGITAL CORE...');
      }
    }, 16); // Fast interval for snappy response (approx 0.8s total loading)

    return () => clearInterval(interval);
  }, [onComplete]);

  // Particle circuit grid visual in canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      dx: number;
      dy: number;
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.7 + 0.2,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      dx: Math.random() > 0.5 ? 1 : -1,
      dy: Math.random() > 0.5 ? 1 : -1
    }));

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = '#020205';
      ctx.fillRect(0, 0, width, height);

      // Draw futuristic circuit grids (subtle)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.01)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floating nodes
      particles.forEach((p) => {
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#020205] z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans">
        {/* Visual background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
          {/* Header Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] text-cyan-400 font-mono tracking-[0.3em] uppercase mb-12 border border-cyan-500/20 px-4 py-1.5 rounded-full bg-cyan-500/5 backdrop-blur-sm"
          >
            CSI PVG COET HQ
          </motion.div>

          {/* Glowing Circular Progress Ring */}
          <div className="relative w-40 h-40 flex items-center justify-center mb-10">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-cyan-500/5 rounded-full filter blur-xl scale-90 animate-pulse" />

            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="72"
                className="stroke-white/5"
                strokeWidth="3"
                fill="transparent"
              />
              {/* Foreground Animated Ring */}
              <circle
                cx="80"
                cy="80"
                r="72"
                className="stroke-cyan-400"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 72}
                strokeDashoffset={2 * Math.PI * 72 * (1 - progress / 100)}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
              />
            </svg>

            {/* Inner Percentage Value */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white tracking-tighter font-mono">
                {progress}%
              </span>
              <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase mt-1">
                LOADING
              </span>
            </div>
          </div>

          {/* Progress Bar (Linear) */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Technical Logs */}
          <div className="h-6 flex items-center justify-center">
            <motion.p
              key={logText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-gray-400 font-mono tracking-wider"
            >
              {logText}
            </motion.p>
          </div>
        </div>

        {/* System Bypass (Skip) */}
        <button
          onClick={onComplete}
          className="absolute bottom-8 text-[9px] text-gray-600 hover:text-cyan-400 font-mono tracking-widest uppercase border border-white/5 bg-white/5 px-4 py-1.5 rounded-md hover:border-cyan-500/30 transition-all cursor-pointer"
        >
          Skip Intro
        </button>
      </div>
    </AnimatePresence>
  );
}
