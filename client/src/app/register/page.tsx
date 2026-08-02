'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiBookOpen, FiClock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const BACKEND_URL = 'http://localhost:5000';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Engineering');
  const [year, setYear] = useState('S.Y Btech');
  const [registrationNumber, setRegistrationNumber] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          department,
          year,
          registrationNumber
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Account created successfully! Connecting to login nodes...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Connecting to auth nodes failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#030303] px-6 py-12">
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-[100px] bottom-0 right-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/5 relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-widest mb-6">
          <FiArrowLeft /> Back to HQ
        </Link>

        <h2 className="cyber-font text-2xl font-black tracking-wider text-white mb-2 uppercase">
          Create Account
        </h2>
        <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-8">
          // CSI Student Chapter Membership
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <FiAlertCircle className="shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <FiAlertCircle className="shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <FiUser />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <FiMail />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <FiLock />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Department</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <FiBookOpen />
                </span>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-400/50 appearance-none select-custom"
                >
                  <option value="Computer Engineering">Computer Dept</option>
                  <option value="Information Technology">IT Dept</option>
                  <option value="AIDS Engineering">AI & DS Dept</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Year</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <FiClock />
                </span>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-400/50 appearance-none select-custom"
                >
                  <option value="S.Y Btech">S.Y Btech</option>
                  <option value="T.E">T.E</option>
                  <option value="B.E">B.E</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Registration No. (Optional)</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. PVG-2024-098"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(189,0,255,0.2)] text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cyber-font mt-6 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating Node...' : 'Register Credentials'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6 font-sans">
          Already registered?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login to HQ
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
