'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin, FiCalendar, FiMapPin, FiCheck } from 'react-icons/fi';
import Loader from '@/components/Loader';
import NetworkGlobe from '@/components/NetworkGlobe';

// Interfaces
interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  category: string;
  department: string;
  year: string;
  photoUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  registrationLink?: string;
  registrationCount?: number;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  message: string;
  avatarUrl?: string;
}

const BACKEND_URL = 'http://localhost:5000';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  
  // Dynamic state loaded from backend
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  
  // Registration feedback status map: { eventId: boolean }
  const [registeredEvents, setRegisteredEvents] = useState<{ [key: string]: boolean }>({});

  const { scrollY } = useScroll();
  const yBgGrid = useTransform(scrollY, [0, 3000], [0, -300]);
  const yGlobe = useTransform(scrollY, [0, 1000], [0, 150]);
  const yAbout = useTransform(scrollY, [0, 2000], [0, -80]);
  const yNews = useTransform(scrollY, [200, 2500], [0, -60]);
  const yEvents = useTransform(scrollY, [500, 3000], [0, -50]);
  const yTestimonials = useTransform(scrollY, [800, 3500], [0, -40]);
  const yTeam = useTransform(scrollY, [1200, 4500], [0, -30]);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const teamRes = await fetch(`${BACKEND_URL}/api/public/team`);
        if (teamRes.ok) setTeam(await teamRes.json());

        const eventsRes = await fetch(`${BACKEND_URL}/api/public/events`);
        if (eventsRes.ok) setEvents(await eventsRes.json());

        const newsRes = await fetch(`${BACKEND_URL}/api/public/news`);
        if (newsRes.ok) setNews(await newsRes.json());

        const testRes = await fetch(`${BACKEND_URL}/api/public/testimonials`);
        if (testRes.ok) setTestimonials(await testRes.json());
      } catch (e) {
        console.warn('Backend server fallback trigger.');
      }
    };
    fetchData();
  }, []);

  const handleRegisterEvent = async (eventId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/public/events/${eventId}/register`, {
        method: 'POST'
      });
      if (res.ok) {
        setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
        const eventsRes = await fetch(`${BACKEND_URL}/api/public/events`);
        if (eventsRes.ok) setEvents(await eventsRes.json());
      }
    } catch (e) {
      setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    }
  };

  // Renders a card with custom 3D mouse tilt simulation
  const TeamCard = ({ member }: { member: TeamMember }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -20;
      const tiltY = (x / rect.width) * 20;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      const card = cardRef.current;
      if (!card) return;
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center transition-all duration-300 ease-out group hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        
        {/* Avatar wrap */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 mb-4 bg-black/40 p-0.5 group-hover:border-cyan-400 transition-colors duration-300">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>

        <h4 className="cyber-font text-white font-bold text-base tracking-wider uppercase">
          {member.name}
        </h4>
        <p className="text-cyan-400 text-sm font-mono mb-2">{member.designation}</p>
        <p className="text-gray-300 text-sm font-sans">
          {member.department} • {member.year}
        </p>

        {/* Social interactions */}
        <div className="flex gap-4 mt-4">
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
          )}
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <FiGithub className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    );
  };

  // Group members into categories
  const coordinators = team.filter((m) => m.category === 'coordinator');
  const presidents = team.filter((m) => m.category === 'president');
  const vicePresidents = team.filter((m) => m.category === 'vice-president');
  const technicalHeads = team.filter((m) => m.category === 'technical');
  const designHeads = team.filter((m) => m.category === 'design');
  const eventHeads = team.filter((m) => m.category === 'publicity');
  const financeHeads = team.filter((m) => m.category === 'finance');

  return (
    <>
      {showIntro ? (
        <Loader onComplete={() => setShowIntro(false)} />
      ) : (
        <main className="min-h-screen relative overflow-hidden bg-[#030303]">
          
          {/* Cyber backgrounds */}
          <motion.div style={{ y: yBgGrid }} className="absolute inset-0 cyber-grid-bg opacity-30 z-0 pointer-events-none" />
          
          {/* Ambient Glow Orbs */}
          <div className="glow-aura w-[500px] h-[500px] bg-cyan-500/10 top-[-10%] left-[-10%]" />
          <div className="glow-aura w-[600px] h-[600px] bg-purple-500/10 bottom-[20%] right-[-10%]" />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center z-10 px-6 pt-16">
            <motion.div style={{ y: yGlobe }} className="absolute inset-0 z-0 pointer-events-none">
              <NetworkGlobe />
            </motion.div>
            <div className="max-w-5xl mx-auto text-center relative z-20 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-6 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm text-cyan-400 font-mono text-sm tracking-widest uppercase hover:border-cyan-400/40 transition-colors"
              >
                Computer Society of India Student Chapter
              </motion.div>
              
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="cyber-font text-5xl sm:text-7xl md:text-[96px] font-black text-white tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-400 pb-2"
              >
                PVG COET PUNE
              </motion.h1>

              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="cyber-font mt-6 text-xl sm:text-3xl md:text-[38px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 font-bold tracking-widest"
              >
                Innovate • Inspire • Integrate
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-8 max-w-3xl text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-sans"
              >
                Welcome to the digital nervous system of PVG COET&apos;s elite technology community. We craft, code, and drive collaboration between humans and systems to solve real-world complexities.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-10 flex flex-wrap gap-4 justify-center"
              >
                <a
                  href="/register"
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-base cyber-font"
                >
                  Join CSI <FiArrowRight />
                </a>
                <a
                  href="#about"
                  className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 text-base cyber-font"
                >
                  Explore Chapter
                </a>
              </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-65 flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">Scroll to Travel</span>
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
            </div>
          </section>

          {/* 2. ABOUT US SECTION */}
          <motion.section id="about" style={{ y: yAbout }} className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            {/* Holographic Scroll Tunnel Visuals */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[300px] border border-cyan-500/5 rounded-full pointer-events-none skew-y-12 animate-pulse" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest block mb-2">// Digital Headquarters</span>
                <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide mb-6">
                  ABOUT CSI COET
                </h2>
                <div className="space-y-6 text-gray-300 text-base sm:text-lg lg:text-[19px] leading-relaxed font-sans font-normal">
                  <p>
                    Established in July 2026 under the department of Computer Engineering, the CSI PVG Student Chapter is the official digital epicentre of technology engineering and creation in PVG&apos;s College of Engineering and Technology, Pune.
                  </p>
                  <p>
                    Our charter is straightforward: to transition traditional textbook engineering into dynamic technology leadership. We orchestrate intense bootcamps, high-stakes hackathons, deep coding encounters, and industrial collaborations, preparing over 150 student members to lead the future tech workspace.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <h5 className="cyber-font text-cyan-400 text-sm sm:text-base uppercase font-bold tracking-wider mb-2">Our Vision</h5>
                    <p className="text-gray-300 text-sm sm:text-base font-sans">To empower students to become leaders in computing technologies and drive global innovations.</p>
                  </div>
                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <h5 className="cyber-font text-purple-400 text-sm sm:text-base uppercase font-bold tracking-wider mb-2">Our Mission</h5>
                    <p className="text-gray-300 text-sm sm:text-base font-sans">Creating meaningful avenues for skill-development, continuous training, research support, and industrial connect.</p>
                  </div>
                </div>
              </div>

              {/* Timeline / Highlights */}
              <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
                <h3 className="cyber-font text-white text-lg sm:text-xl uppercase tracking-wider mb-6 font-bold">Timeline & Milestones</h3>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-cyan-500/20">
                  <div className="relative pl-8">
                    <div className="absolute left-[3px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    <span className="text-xs sm:text-sm text-cyan-400 font-mono">July 2026</span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">Chapter Inauguration</h4>
                    <p className="text-sm sm:text-base text-gray-400 mt-1.5">Officially established the student chapter with 150+ founding members under Department of Computer Engineering guidance.</p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-[3px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#bd00ff]" />
                    <span className="text-xs sm:text-sm text-purple-400 font-mono">August 2026</span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">Digital Headquarters Launch</h4>
                    <p className="text-sm sm:text-base text-gray-400 mt-1.5">Unveiled the futuristic digital headquarters with interactive Web Audio synth and dynamic CMS capabilities.</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <a
                    href="/register"
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-widest hover:underline"
                  >
                    Become a member now <FiArrowRight />
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 3. RECENT NEWS SECTION */}
          <motion.section id="news" style={{ y: yNews }} className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest block mb-2">// Global Feed</span>
              <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                RECENT NEWS
              </h2>
            </div>

            {news.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto">
                <p className="text-gray-300 font-mono uppercase tracking-widest text-sm sm:text-base">
                  Coming Soon • News Node Offline
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  We are preparing our dynamic news broadcast feed. Stay tuned!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item) => (
                  <div
                    key={item._id}
                    className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div>
                      {item.imageUrl && (
                        <div className="w-full h-44 rounded-xl overflow-hidden mb-4">
                          <img
                            src={`${BACKEND_URL}${item.imageUrl}`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <span className="text-xs text-cyan-400 font-mono block mb-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <h4 className="cyber-font text-white font-bold text-base tracking-wide mb-3">
                        {item.title}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 4. EVENTS SECTION */}
          <motion.section id="events" style={{ y: yEvents }} className="relative z-10 py-24 px-6 bg-black/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-purple-400 font-mono text-sm uppercase tracking-widest block mb-2">// Space-Time Events</span>
                <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                  UPCOMING EVENTS
                </h2>
              </div>

              {events.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto">
                  <p className="text-gray-300 font-mono uppercase tracking-widest text-sm sm:text-base">
                    Coming Soon • Registration Node Offline
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Our technical symposium schedules are currently forming. Registration doors open shortly!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {events.map((evt) => (
                    <div
                      key={evt._id}
                      className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-cyan-500/20 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full filter blur-xl" />
                      
                      <div>
                        {evt.imageUrl && (
                          <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                            <img
                              src={`${BACKEND_URL}${evt.imageUrl}`}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h4 className="cyber-font text-white font-bold text-lg tracking-wide mb-3">
                          {evt.title}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                          {evt.description}
                        </p>

                        <div className="space-y-2 text-sm font-mono text-gray-400 mb-6">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-cyan-400" />
                            {new Date(evt.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-purple-400" />
                            {evt.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-gray-400 font-mono">
                          {evt.registrationCount || 0} SEATS RESERVED
                        </span>
                        
                        {registeredEvents[evt._id] ? (
                          <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-mono rounded-full flex items-center gap-1.5 cursor-default">
                            <FiCheck /> Secured
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegisterEvent(evt._id)}
                            className="px-5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 text-sm font-mono rounded-full uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Reserve Seat
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* 5. TESTIMONIALS SECTION */}
          <motion.section id="testimonials" style={{ y: yTestimonials }} className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest block mb-2">// Network Reviews</span>
              <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                TESTIMONIALS
              </h2>
            </div>

            {testimonials.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto">
                <p className="text-gray-300 font-mono uppercase tracking-widest text-sm sm:text-base">
                  Coming Soon • Testimonials Offline
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Feedback from our industry advisors and team is propagating to the network.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((test) => (
                  <div
                    key={test._id}
                    className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
                  >
                    <p className="text-gray-300 italic text-sm leading-relaxed mb-6 font-sans">
                      &ldquo;{test.message}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 bg-black/40">
                        <img
                          src={test.avatarUrl || '/placeholder.png'}
                          alt={test.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <div>
                        <h5 className="cyber-font text-white text-sm font-bold">{test.name}</h5>
                        <p className="text-gray-500 text-xs font-mono">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 6. TEAM SECTION (Moved to last as requested) */}
          <motion.section id="team" style={{ y: yTeam }} className="relative z-10 py-24 px-6 bg-black/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-purple-400 font-mono text-sm uppercase tracking-widest block mb-2">// Expert Network</span>
                <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                  MEET THE LEADERSHIP
                </h2>
                <p className="text-gray-400 text-base mt-3 max-w-xl mx-auto">
                  Our student chapter is managed by visionary guides and a dynamic core team of student heads.
                </p>
              </div>

              {/* A. Faculty Coordinators */}
              {coordinators.length > 0 && (
                <div className="mb-16">
                  <h3 className="cyber-font text-base uppercase text-gray-400 tracking-widest text-center mb-8 border-b border-white/5 pb-2 max-w-md mx-auto">
                    Faculty Coordinators
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {coordinators.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* B. Executive Chairs (President & Vice President) */}
              {(presidents.length > 0 || vicePresidents.length > 0) && (
                <div className="mb-16">
                  <h3 className="cyber-font text-base uppercase text-gray-400 tracking-widest text-center mb-8 border-b border-white/5 pb-2 max-w-md mx-auto">
                    Executive Officers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {presidents.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                    {vicePresidents.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* C. Technical Heads (Rendered Side-By-Side) */}
              {technicalHeads.length > 0 && (
                <div className="mb-16">
                  <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                    Technical Heads
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {technicalHeads.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* D. Other Heads (Design, Publicity, Finance in separate groups) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                {/* Design Heads */}
                {designHeads.length > 0 && (
                  <div>
                    <h3 className="cyber-font text-sm uppercase text-gray-400 tracking-wider mb-6 border-b border-white/5 pb-2 text-center">
                      Design Heads
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {designHeads.map((member) => (
                        <TeamCard key={member._id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Publicity Heads */}
                {eventHeads.length > 0 && (
                  <div>
                    <h3 className="cyber-font text-sm uppercase text-gray-400 tracking-wider mb-6 border-b border-white/5 pb-2 text-center">
                      Event & Publicity Heads
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {eventHeads.map((member) => (
                        <TeamCard key={member._id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance Heads */}
                {financeHeads.length > 0 && (
                  <div>
                    <h3 className="cyber-font text-sm uppercase text-gray-400 tracking-wider mb-6 border-b border-white/5 pb-2 text-center">
                      Finance Heads
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {financeHeads.map((member) => (
                        <TeamCard key={member._id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* FOOTER */}
          <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center bg-black/80 backdrop-blur-sm">
            <p className="cyber-font text-cyan-400 text-neon-cyan text-base font-bold tracking-wider mb-2">
              COMPUTER SOCIETY OF INDIA PVG COET
            </p>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
              © 2026 CSI PVG COET. Crafted by CSI PVG Tech Heads.
            </p>
          </footer>
        </main>
      )}
    </>
  );
}
