'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiInfo, FiFileText, FiAward, FiCalendar, FiMenu, FiX, FiUsers } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Monitor scroll for glass effect adjustments and active section highlighting
  useEffect(() => {
    const sectionIds = ['about', 'news', 'events', 'testimonials', 'team'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      if (pathname !== '/') {
        setActiveSection('');
        return;
      }

      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

      const scrollPosition = window.scrollY + 250;
      let current = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = `#${id}`;
          }
        }
      }

      if (current) {
        setActiveSection(current);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome /> },
    { name: 'About Us', path: '#about', icon: <FiInfo /> },
    { name: 'Recent News', path: '#news', icon: <FiFileText /> },
    { name: 'Events', path: '#events', icon: <FiCalendar /> },
    { name: 'Testimonials', path: '#testimonials', icon: <FiAward /> },
    { name: 'Team', path: '#team', icon: <FiUsers /> }
  ];

  return (
    <header className="fixed top-6 left-0 w-full z-50 px-4 md:px-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border border-white/10 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border-cyan-500/20' 
            : 'bg-black/20 backdrop-blur-sm'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 md:gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400/40 flex items-center justify-center bg-black/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300">
              <img src="/csi_logo.png" alt="CSI Logo" className="w-[85%] h-[85%] object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="cyber-font text-cyan-400 text-neon-cyan text-xs md:text-sm font-black tracking-wider leading-none">
              CSI PVG COET
            </span>
            <span className="text-[7px] md:text-[9px] text-gray-500 font-mono tracking-widest uppercase mt-0.5 leading-none">
              Student Chapter
            </span>
          </div>
        </Link>

        {/* Navigation Items - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isAnchor = item.path.startsWith('#');
            const isActive = isAnchor 
              ? activeSection === item.path 
              : (pathname === item.path && activeSection === '');

            return (
              <a
                key={item.name}
                href={item.path}
                className={`relative flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono transition-all duration-300 hover:text-cyan-400 ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                }`}
              >
                {item.icon}
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons & Hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Hamburger Menu Toggle for Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center p-2 text-white border border-white/10 hover:border-white/20 rounded-full transition-all bg-black/40 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FiX className="w-4.5 h-4.5" /> : <FiMenu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute top-20 left-4 right-4 glass-panel p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] md:hidden flex flex-col gap-4 z-40"
          >
            {navItems.map((item) => {
              const isAnchor = item.path.startsWith('#');
              const isActive = isAnchor 
                ? activeSection === item.path 
                : (pathname === item.path && activeSection === '');

              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 text-sm uppercase tracking-wider font-mono py-2 border-b border-white/5 transition-all ${
                    isActive ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-cyan-400'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
