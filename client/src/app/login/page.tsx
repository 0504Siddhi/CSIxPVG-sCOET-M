'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const BACKEND_URL = 'http://localhost:5000';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot password modal
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user details
      localStorage.setItem('csi_token', data.token);
      localStorage.setItem('csi_user', JSON.stringify(data.user));

      // Set cookie dynamically on client side
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=strict`;

      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event('login_changed'));

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting to auth nodes failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: forgotEmail, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Reset failed');
      }
      setForgotMessage(data.message || 'Password reset success!');
      setTimeout(() => setShowForgot(false), 2000);
    } catch (err: any) {
      setForgotError(err.message || 'Error resets.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#030303] px-6 py-12">
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full filter blur-[100px] -top-20 -left-20 pointer-events-none" />

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
          Portal Login
        </h2>
        <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-8">
          // CSI Student Chapter Database Access
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <FiAlertCircle className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="csi@pvgcoet.ac.in"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[10px] text-cyan-400 hover:underline uppercase tracking-widest font-mono bg-transparent border-0 cursor-pointer"
              >
                Forgot?
              </button>
            </div>
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
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cyber-font mt-8 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate Credentials'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8 font-sans">
          No digital credential yet?{' '}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register Chapter Account
          </Link>
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/5"
          >
            <h3 className="cyber-font text-lg font-bold text-white mb-2 uppercase">Reset Password</h3>
            <p className="text-xs text-gray-400 font-mono uppercase mb-6">// Credentials Recovery Node</p>

            {forgotError && <p className="mb-4 text-xs text-red-400 font-mono">{forgotError}</p>}
            {forgotMessage && <p className="mb-4 text-xs text-emerald-400 font-mono">{forgotMessage}</p>}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">Registered Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                  placeholder="student@gmail.com"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2 bg-transparent text-gray-400 text-xs font-mono uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-cyan-500/30 transition-all cursor-pointer"
                >
                  Submit Reset
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
