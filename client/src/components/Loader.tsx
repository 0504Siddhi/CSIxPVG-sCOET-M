'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { audioSynth } from './AudioSynth';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [scene, setScene] = useState(1); // 1: Tap to Enter, 2: Hands Slide, 3: Touch & Spark, 4: Portal Fly, 5: Logo & Transition
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);

  // Handle particle system
  useEffect(() => {
    if (!started || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Classes
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
      maxLife: number;
    }

    interface CircuitLine {
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      color: string;
      opacity: number;
    }

    interface PortalCube {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speedZ: number;
    }

    const sparks: Spark[] = [];
    const lines: CircuitLine[] = [];
    const portalCubes: PortalCube[] = [];
    let portalRadius = 0;
    let cameraZ = 0;

    // Create sparks helper
    const addSparks = (x: number, y: number, count: number, speed: number = 5) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const s = Math.random() * speed + 1;
        const color = Math.random() > 0.5 ? '#00f0ff' : '#bd00ff';
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          color,
          size: Math.random() * 3 + 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 80) + 40
        });
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.2)'; // trail effect
      ctx.fillRect(0, 0, width, height);

      // Handle Scene 2: Finger closeness sparks
      if (scene === 2) {
        if (Math.random() < 0.25) {
          // Spark in center
          addSparks(width / 2, height / 2, 2, 2);
        }
      }

      // Handle Scene 3: Touching touch explosion
      if (scene === 3) {
        if (sparks.length < 50) {
          addSparks(width / 2, height / 2, 20, 8);
        }

        // Draw electrical pulse rings
        portalRadius += 10;
        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - portalRadius / 300)})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, portalRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(189, 0, 255, ${Math.max(0, 1 - portalRadius / 400)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, portalRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Handle Scene 4: Cyber universe fly through
      if (scene === 4 || scene === 5) {
        cameraZ += 5;
        // Spawn portal items
        if (portalCubes.length < 150) {
          portalCubes.push({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: cameraZ + 600,
            size: Math.random() * 20 + 5,
            color: Math.random() > 0.6 ? 'rgba(0, 240, 255, 0.7)' : 'rgba(189, 0, 255, 0.7)',
            speedZ: Math.random() * 2 + 1
          });
        }

        // Draw portal rings in 3D
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let r = 50; r < 600; r += 100) {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, r * (1 + (cameraZ % 100) / 100), 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Hexagonal grids overlay
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
        ctx.lineWidth = 1;
        const hexSize = 60;
        for (let x = 0; x < width + hexSize; x += hexSize * 1.5) {
          for (let y = 0; y < height + hexSize; y += hexSize * Math.sqrt(3)) {
            ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
              ctx.lineTo(x + hexSize * Math.cos(angle), y + hexSize * Math.sin(angle));
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }

      // Update & Draw Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0, s.size * (1 - s.life / s.maxLife)), 0, Math.PI * 2);
        ctx.fill();

        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
        }
      }
      ctx.shadowBlur = 0; // reset glow

      // Draw portal cubes
      for (let i = portalCubes.length - 1; i >= 0; i--) {
        const cube = portalCubes[i];
        const relativeZ = cube.z - cameraZ;

        if (relativeZ <= 0) {
          portalCubes.splice(i, 1);
          continue;
        }

        // Project 3D coordinates to 2D
        const fov = 300;
        const screenX = width / 2 + (cube.x * fov) / relativeZ;
        const screenY = height / 2 + (cube.y * fov) / relativeZ;
        const screenScale = (cube.size * fov) / relativeZ;

        if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) {
          continue;
        }

        ctx.fillStyle = cube.color;
        ctx.fillRect(screenX - screenScale / 2, screenY - screenScale / 2, screenScale, screenScale);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(screenX - screenScale / 2, screenY - screenScale / 2, screenScale, screenScale);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [started, scene]);

  // Run sequence timing
  const startSequence = () => {
    setStarted(true);
    audioSynth.start();

    // Scene 2: Hands slide in
    setScene(2);

    // GSAP Animation to slide hands towards center
    const leftEl = leftHandRef.current;
    const rightEl = rightHandRef.current;

    if (leftEl && rightEl) {
      // Initialize starting offsets with 3D rotations for swoop effect!
      gsap.set(leftEl, { 
        x: '-60vw',
        rotationY: 45, 
        rotationZ: 5,
        transformOrigin: "left center" 
      });
      gsap.set(rightEl, { 
        x: '60vw',
        rotationY: -45, 
        rotationZ: -5,
        transformOrigin: "right center" 
      });

      // Hands slide in to meet at the center with a slight overlap to close the image's finger gap
      gsap.to(leftEl, {
        x: '4.5vw',
        rotationY: 0,
        rotationZ: 0,
        duration: 3.5,
        ease: 'power2.out'
      });
      gsap.to(rightEl, {
        x: '-4.5vw',
        rotationY: 0,
        rotationZ: 0,
        duration: 3.5,
        ease: 'power2.out',
        onComplete: () => {
          // Scene 3: fingertips touch
          setScene(3);
          audioSynth.triggerTouchExplosion();

          // Hide hands and show portal explosion
          gsap.to([leftEl, rightEl], {
            opacity: 0,
            scale: 1.2,
            duration: 0.5,
            delay: 0.5,
            onComplete: () => {
              // Scene 4: portal fly through
              setScene(4);
              
              // After 3 seconds, show logo and transition out
              setTimeout(() => {
                setScene(5);
                
                // Final exit transition
                setTimeout(() => {
                  audioSynth.stop();
                  onComplete();
                }, 3000);
              }, 3000);
            }
          });
        }
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#030303] z-[9999] flex flex-col items-center justify-center overflow-hidden">
        {/* Canvas background for particles, portal, grid */}
        {started && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        )}

        {/* Scene 1: Tap to Enter */}
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center z-10"
          >
            <h2 className="cyber-font text-xl md:text-2xl text-cyan-400 text-neon-cyan mb-8 tracking-widest text-center px-4">
              CSI PVG STUDENT CHAPTER
            </h2>
            <button
              onClick={startSequence}
              className="px-8 py-3 bg-transparent border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-400 font-medium tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] cyber-font text-sm uppercase hover:scale-105"
            >
              Initialize Digital HQ
            </button>
            <p className="text-gray-500 text-xs mt-4 tracking-wider uppercase font-mono">
              [ Headphone Recommended • Audio Gesture Required ]
            </p>
          </motion.div>
        )}

        {/* Scene 2 & 3: Hands sliding and touching */}
        {started && (scene === 2 || scene === 3) && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
            style={{ perspective: 1000 }}
          >
            {/* Left Robot Hand */}
            <div
              ref={leftHandRef}
              className="absolute w-[80vw] sm:w-[60vw] max-w-[900px] h-[30vh] sm:h-[45vh] left-[calc(50%-40vw)] sm:left-[calc(50%-30vw)] lg:left-[calc(50%-450px)] flex items-center justify-center opacity-95"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src="/hands.jpg"
                alt="Robotic Hand"
                className="w-full h-full object-cover"
                style={{
                  clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                  filter: 'invert(1) drop-shadow(0 0 25px rgba(0, 240, 255, 0.6))',
                  mixBlendMode: 'screen'
                }}
              />
            </div>

            {/* Right Human Hand */}
            <div
              ref={rightHandRef}
              className="absolute w-[80vw] sm:w-[60vw] max-w-[900px] h-[30vh] sm:h-[45vh] left-[calc(50%-40vw)] sm:left-[calc(50%-30vw)] lg:left-[calc(50%-450px)] flex items-center justify-center opacity-95"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src="/hands.jpg"
                alt="Human Hand"
                className="w-full h-full object-cover"
                style={{
                  clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                  filter: 'invert(1) drop-shadow(0 0 25px rgba(189, 0, 255, 0.6))',
                  mixBlendMode: 'screen'
                }}
              />
            </div>
          </div>
        )}

        {/* Scene 5: Logo reveal */}
        {started && scene === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="flex flex-col items-center z-20"
          >
            <div className="flex gap-4 md:gap-8 items-center justify-center">
              <div className="relative w-28 h-28 md:w-40 md:h-40 p-2 bg-black/40 rounded-full border border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
                <img
                  src="/logo.png"
                  alt="PVG COET"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                />
              </div>
              <div className="relative w-28 h-28 md:w-40 md:h-40 p-2 bg-black/40 rounded-full border border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
                <img
                  src="/csi_logo.png"
                  alt="CSI Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                />
              </div>
            </div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="cyber-font mt-8 text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider text-center"
            >
              CSI PVG COET
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.5 }}
              className="text-xs text-gray-400 tracking-widest mt-2 uppercase font-mono"
            >
              Innovate • Inspire • Integrate
            </motion.p>
          </motion.div>
        
        )}

        {/* Skip button shown during active loading scene */}
        {started && (
          <button
            onClick={() => {
              audioSynth.stop();
              onComplete();
            }}
            className="absolute bottom-6 right-6 px-4 py-2 border border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20 text-[10px] text-gray-400 hover:text-white uppercase font-mono tracking-widest rounded-lg transition-all z-50 cursor-pointer"
          >
            Skip Intro
          </button>
        )}
      </div>
    </AnimatePresence>
  );
}
