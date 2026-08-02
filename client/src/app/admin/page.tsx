'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiLayout, FiCalendar, FiFileText, FiAward, FiUsers, 
  FiTrash2, FiPlus, FiEdit2, FiLogOut, FiArrowLeft, FiPieChart 
} from 'react-icons/fi';

const BACKEND_URL = 'http://localhost:5000';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'events' | 'news' | 'testimonials' | 'team' | 'students'>('analytics');
  
  // Auth states
  const [adminUser, setAdminUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Data states
  const [analytics, setAnalytics] = useState<any>({ students: 0, events: 0, news: 0, testimonials: 0, team: 0, registrations: 0 });
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Editing state toggles / triggers
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'event' | 'news' | 'testimonial' | 'team'>('event');

  // Unified Form Data (holds all fields, we will extract what we need)
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', registrationLink: '',
    content: '',
    name: '', role: '', message: '',
    designation: '', category: 'technical', department: 'Computer Department', year: 'S.Y Btech', linkedinUrl: '', githubUrl: '', order: '0'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // 1. Verify Admin Status
    const storedUser = localStorage.getItem('csi_user');
    const storedToken = localStorage.getItem('csi_token');

    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin' || parsedUser.email !== 'csi@pvgcoet.ac.in') {
      router.push('/login');
      return;
    }

    setAdminUser(parsedUser);
    setToken(storedToken);
    setLoading(false);
  }, [router]);

  // Load selected tab data
  useEffect(() => {
    if (!token) return;
    loadTabData();
  }, [token, activeTab]);

  const loadTabData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'analytics') {
        const res = await fetch(`${BACKEND_URL}/api/admin/analytics`, { headers });
        if (res.ok) setAnalytics(await res.json());
      }
      else if (activeTab === 'events') {
        const res = await fetch(`${BACKEND_URL}/api/public/events`);
        if (res.ok) setEvents(await res.json());
      }
      else if (activeTab === 'news') {
        const res = await fetch(`${BACKEND_URL}/api/public/news`);
        if (res.ok) setNews(await res.json());
      }
      else if (activeTab === 'testimonials') {
        const res = await fetch(`${BACKEND_URL}/api/public/testimonials`);
        if (res.ok) setTestimonials(await res.json());
      }
      else if (activeTab === 'team') {
        const res = await fetch(`${BACKEND_URL}/api/public/team`);
        if (res.ok) setTeam(await res.json());
      }
      else if (activeTab === 'students') {
        const res = await fetch(`${BACKEND_URL}/api/admin/students`, { headers });
        if (res.ok) setStudents(await res.json());
      }
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('csi_token');
    localStorage.removeItem('csi_user');
    window.dispatchEvent(new Event('login_changed'));
    router.push('/');
  };

  // Delete handlers
  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Form Submissions
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append file if exists
    if (selectedFile) {
      const fieldName = formType === 'team' ? 'photo' : formType === 'testimonial' ? 'avatar' : 'image';
      data.append(fieldName, selectedFile);
    }

    // Append regular fields based on formType
    if (formType === 'event') {
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('location', formData.location);
      data.append('registrationLink', formData.registrationLink);
    } else if (formType === 'news') {
      data.append('title', formData.title);
      data.append('content', formData.content);
    } else if (formType === 'testimonial') {
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('message', formData.message);
    } else if (formType === 'team') {
      data.append('name', formData.name);
      data.append('designation', formData.designation);
      data.append('category', formData.category);
      data.append('department', formData.department);
      data.append('year', formData.year);
      data.append('linkedinUrl', formData.linkedinUrl);
      data.append('githubUrl', formData.githubUrl);
      data.append('order', formData.order);
    }

    try {
      const url = editId 
        ? `${BACKEND_URL}/api/admin/${formType === 'team' ? 'team' : formType + 's'}/${editId}` 
        : `${BACKEND_URL}/api/admin/${formType === 'team' ? 'team' : formType + 's'}`;

      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        setModalOpen(false);
        setEditId(null);
        setSelectedFile(null);
        loadTabData();
        // Reset form
        setFormData({
          title: '', description: '', date: '', location: '', registrationLink: '',
          content: '',
          name: '', role: '', message: '',
          designation: '', category: 'technical', department: 'Computer Department', year: 'S.Y Btech', linkedinUrl: '', githubUrl: '', order: '0'
        });
      } else {
        alert('Server returned error submitting form.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (type: 'event' | 'news' | 'testimonial' | 'team', item: any) => {
    setFormType(type);
    setEditId(item._id);
    setSelectedFile(null);

    if (type === 'event') {
      setFormData({
        ...formData,
        title: item.title,
        description: item.description,
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
        location: item.location,
        registrationLink: item.registrationLink || ''
      });
    } else if (type === 'news') {
      setFormData({
        ...formData,
        title: item.title,
        content: item.content
      });
    } else if (type === 'testimonial') {
      setFormData({
        ...formData,
        name: item.name,
        role: item.role,
        message: item.message
      });
    } else if (type === 'team') {
      setFormData({
        ...formData,
        name: item.name,
        designation: item.designation,
        category: item.category,
        department: item.department,
        year: item.year,
        linkedinUrl: item.linkedinUrl || '',
        githubUrl: item.githubUrl || '',
        order: String(item.order || 0)
      });
    }

    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center font-mono text-cyan-400 text-xs">
        VERIFYING CORE SECURITY CLEARANCE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col md:flex-row relative">
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-black/60 backdrop-blur-md border-r border-white/5 p-6 flex flex-col justify-between z-10 shrink-0 md:sticky md:top-0 md:h-screen">
        <div>
          <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-8">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/30">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="cyber-font text-xs font-bold text-white tracking-wider">CSI PVG HQ</h3>
              <p className="text-[9px] text-gray-500 font-mono uppercase">Admin Terminal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
              { id: 'team', label: 'Manage Team', icon: <FiUsers /> },
              { id: 'events', label: 'Manage Events', icon: <FiCalendar /> },
              { id: 'news', label: 'Manage News', icon: <FiFileText /> },
              { id: 'testimonials', label: 'Testimonials', icon: <FiAward /> },
              { id: 'students', label: 'Students Roster', icon: <FiLayout /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-white/10 hover:border-white/20 text-white text-xs font-mono uppercase cursor-pointer"
          >
            <FiArrowLeft /> View Live Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-mono uppercase cursor-pointer"
          >
            <FiLogOut /> Shut Down
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 z-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
          <div>
            <h1 className="cyber-font text-xl md:text-2xl font-black text-white tracking-widest uppercase">
              {activeTab === 'analytics' ? 'HQ Operational Diagnostics' : `Manage ${activeTab}`}
            </h1>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">
              // Database node status: connected • logged in as {adminUser?.name}
            </p>
          </div>

          {activeTab !== 'analytics' && activeTab !== 'students' && (
            <button
              onClick={() => {
                setFormType(activeTab === 'team' ? 'team' : activeTab === 'events' ? 'event' : activeTab === 'news' ? 'news' : 'testimonial');
                setEditId(null);
                setSelectedFile(null);
                setFormData({
                  title: '', description: '', date: '', location: '', registrationLink: '',
                  content: '',
                  name: '', role: '', message: '',
                  designation: '', category: 'technical', department: 'Computer Department', year: 'S.Y Btech', linkedinUrl: '', githubUrl: '', order: '0'
                });
                setModalOpen(true);
              }}
              className="flex items-center gap-2 py-2.5 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              <FiPlus /> Register New Entry
            </button>
          )}
        </div>

        {/* Dynamic Panels */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Counts grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Registered Students', val: analytics.students, color: 'text-cyan-400' },
                { label: 'Total Events', val: analytics.events, color: 'text-purple-400' },
                { label: 'News Broadcasts', val: analytics.news, color: 'text-blue-400' },
                { label: 'Seat Registrations', val: analytics.registrations, color: 'text-emerald-400' }
              ].map((stat, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">{stat.label}</span>
                  <h3 className={`cyber-font text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</h3>
                </div>
              ))}
            </div>

            {/* Diagnostic Logs container */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="cyber-font text-xs font-bold text-white tracking-widest uppercase mb-4">HQ Neural Logs</h3>
              <div className="bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-gray-400 space-y-2 h-64 overflow-y-auto">
                <p className="text-cyan-400">[SYSTEM] Connection authenticated securely via JWT keys.</p>
                <p className="text-purple-400">[DATABASE] Loaded team model roster: {analytics.team} nodes online.</p>
                <p className="text-emerald-400">[ANALYTICS] Registrations sum checked: {analytics.registrations} seat nodes populated.</p>
                <p className="text-gray-500">[INFO] Cron triggers ready for newsletter automation.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Lists: Events, News, Testimonials, Team */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div key={evt._id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="cyber-font text-white font-bold text-sm tracking-wide mb-1">{evt.title}</h4>
                  <p className="text-[10px] text-cyan-400 font-mono mb-3">{new Date(evt.date).toLocaleDateString()} • {evt.location}</p>
                  <p className="text-gray-400 text-xs line-clamp-3 mb-4">{evt.description}</p>
                </div>
                <div className="flex gap-2 justify-end border-t border-white/5 pt-4">
                  <button onClick={() => handleEditClick('event', evt)} className="p-2 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 rounded-lg cursor-pointer">
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete('events', evt._id)} className="p-2 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg cursor-pointer">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item._id} className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-6">
                <div>
                  <h4 className="cyber-font text-white font-bold text-sm tracking-wide mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{item.content}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick('news', item)} className="p-2 border border-cyan-500/20 text-cyan-400 rounded-lg cursor-pointer">
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete('news', item._id)} className="p-2 border border-red-500/20 text-red-400 rounded-lg cursor-pointer">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((test) => (
              <div key={test._id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <p className="text-gray-300 italic text-xs leading-relaxed mb-6 font-sans">&ldquo;{test.message}&rdquo;</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="cyber-font text-white text-xs font-bold">{test.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({test.role})</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick('testimonial', test)} className="p-2 border border-cyan-500/20 text-cyan-400 rounded-lg cursor-pointer">
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('testimonials', test._id)} className="p-2 border border-red-500/20 text-red-400 rounded-lg cursor-pointer">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member._id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-cyan-500/20 mb-3 bg-black/40">
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h5 className="cyber-font text-white font-bold text-xs tracking-wide">{member.name}</h5>
                  <p className="text-cyan-400 text-[10px] font-mono mb-2">{member.designation}</p>
                  <p className="text-gray-400 text-[10px] font-sans">{member.department} • {member.year}</p>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 w-full justify-center">
                  <button onClick={() => handleEditClick('team', member)} className="p-2 border border-cyan-500/20 text-cyan-400 rounded-lg cursor-pointer">
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete('team', member._id)} className="p-2 border border-red-500/20 text-red-400 rounded-lg cursor-pointer">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 font-mono text-[10px] text-gray-400 uppercase tracking-widest text-left">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Year</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-white/5">
                      <td className="p-4 font-medium text-white">{student.name}</td>
                      <td className="p-4 font-mono">{student.email}</td>
                      <td className="p-4">{student.department}</td>
                      <td className="p-4">{student.year}</td>
                      <td className="p-4">
                        <button onClick={() => handleDelete('students', student._id)} className="p-2 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg cursor-pointer">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Editor Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full glass-panel p-8 rounded-2xl border border-white/5 relative"
          >
            <h3 className="cyber-font text-base font-black text-white tracking-widest uppercase mb-6">
              {editId ? 'Modify System Entry' : 'Create New System Entry'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              
              {/* Event Fields */}
              {formType === 'event' && (
                <>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Event Title</label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Description</label>
                    <textarea
                      required rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Date</label>
                      <input
                        type="date" required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Location</label>
                      <input
                        type="text" required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Registration Link (Optional)</label>
                    <input
                      type="text"
                      value={formData.registrationLink}
                      onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Banner Image</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* News Fields */}
              {formType === 'news' && (
                <>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Headline Title</label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Content</label>
                    <textarea
                      required rows={5}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Attached Image</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Testimonial Fields */}
              {formType === 'testimonial' && (
                <>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Author Name</label>
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Role/Position</label>
                    <input
                      type="text" required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Message</label>
                    <textarea
                      required rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Avatar Icon</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Team Member Fields */}
              {formType === 'team' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Member Name</label>
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Designation</label>
                      <input
                        type="text" required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Category Role</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none appearance-none"
                      >
                        <option value="coordinator">Faculty Coordinator</option>
                        <option value="president">President</option>
                        <option value="vice-president">Vice President</option>
                        <option value="technical">Technical Head</option>
                        <option value="design">Design Head</option>
                        <option value="publicity">Event & Publicity Head</option>
                        <option value="finance">Finance Head</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Department</label>
                      <input
                        type="text" required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Year</label>
                      <input
                        type="text" required
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Order Weight</label>
                      <input
                        type="number" required
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">LinkedIn Link</label>
                      <input
                        type="text"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">GitHub Link</label>
                      <input
                        type="text"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-2">Member Photo</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-gray-400 text-xs font-mono uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-cyan-500/30 transition-all cursor-pointer"
                >
                  Commit changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
