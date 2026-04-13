import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiShieldUserLine, RiMailLine, RiLockPasswordLine,
  RiLoginBoxLine, RiArrowLeftLine, RiEyeLine, RiEyeOffLine,
  RiCheckboxCircleLine
} from 'react-icons/ri';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login({ email: form.email, password: form.password });
      if (data.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <Link to="/" className="relative flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <RiArrowLeftLine /> Back to home
        </Link>

        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-8">
            <RiShieldUserLine className="text-brand-400 text-3xl" />
          </div>
          <h2 className="font-display text-4xl font-semibold mb-4 leading-tight">
            Admin<br />Control Panel
          </h2>
          <p className="font-body text-slate-400 text-sm leading-relaxed mb-8">
            Manage ad submissions, review campaigns, and keep the platform running smoothly.
          </p>
          <ul className="space-y-2">
            {['View all ad submissions', 'Approve or reject campaigns', 'Monitor platform activity', 'Manage user accounts'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-slate-400 text-sm font-body">
                <RiCheckboxCircleLine className="text-brand-500 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <p className="font-mono text-xs text-slate-500 mb-1">Default credentials (seed via backend)</p>
          <p className="font-mono text-xs text-slate-300">Run: <span className="text-brand-400">node utils/seed.js</span></p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-sm font-body mb-8 transition-colors lg:hidden">
            <RiArrowLeftLine /> Back to home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <RiShieldUserLine className="text-white text-xl" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white leading-none">AdPortal Admin</p>
              <p className="font-body text-xs text-slate-500">Restricted access</p>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold text-white mb-1">Admin Sign In</h1>
          <p className="font-body text-slate-500 text-sm mb-8">Enter your admin credentials to continue.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="Admin email" required
                className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-700 bg-slate-800 text-white
                           text-sm placeholder-slate-600 font-body
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
            </div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                placeholder="Password" required
                className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-slate-700 bg-slate-800 text-white
                           text-sm placeholder-slate-600 font-body
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white
                         font-body font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><RiLoginBoxLine /> Sign In to Admin Panel</>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <Link to="/user/login" className="text-xs font-body text-slate-600 hover:text-slate-400 transition-colors">
              Regular user? Login here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
