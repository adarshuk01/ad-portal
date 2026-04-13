import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiUserAddLine, RiMailLine, RiLockPasswordLine, RiPhoneLine,
  RiUserLine, RiArrowLeftLine, RiEyeLine, RiEyeOffLine,
  RiAdvertisementLine, RiCheckLine
} from 'react-icons/ri';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function UserRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const data = await authAPI.register({
        name: form.name, email: form.email, phone: form.phone, password: form.password,
      });
      login(data);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-12 text-white">
        <Link to="/" className="flex items-center gap-2 text-brand-200 hover:text-white transition-colors">
          <RiAdvertisementLine className="text-2xl" />
          <span className="font-display text-xl font-semibold">AdPortal</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-semibold mb-4 leading-tight">
            Start advertising<br />in minutes.
          </h2>
          <p className="font-body text-brand-200 text-sm leading-relaxed mb-8">
            Join thousands of businesses that trust AdPortal to manage their advertising campaigns.
          </p>
          <ul className="space-y-3">
            {['Free registration', 'Fast ad approval', 'Real-time status tracking', 'Dedicated support'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-brand-100 text-sm font-body">
                <RiCheckLine className="text-brand-300 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-body text-brand-400 text-xs">© 2025 AdPortal. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-body mb-8 transition-colors">
            <RiArrowLeftLine /> Back to home
          </Link>

          <h1 className="font-display text-4xl font-semibold text-slate-900 mb-1">Create account</h1>
          <p className="font-body text-slate-500 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/user/login" className="text-brand-600 hover:text-brand-700 font-semibold">Sign in</Link>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="name" value={form.name} onChange={handle} placeholder="Full name"
                required className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email address"
                required className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="phone" value={form.phone} onChange={handle} placeholder="Phone number"
                className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                placeholder="Password (min 6 chars)" required className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="confirm" type={showPw ? 'text' : 'password'} value={form.confirm} onChange={handle}
                placeholder="Confirm password" required className="input-field pl-11" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 flex items-center justify-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><RiUserAddLine /> Create Account</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
