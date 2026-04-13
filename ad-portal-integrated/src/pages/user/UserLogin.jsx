import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiMailLine, RiLockPasswordLine, RiLoginBoxLine,
  RiArrowLeftLine, RiEyeLine, RiEyeOffLine, RiAdvertisementLine
} from 'react-icons/ri';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      if (data.user.role === 'admin') {
        setError('Use the admin portal to login as admin.');
        setLoading(false);
        return;
      }
      login(data);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-100 rounded-full opacity-60 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-200 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-body mb-8 transition-colors">
          <RiArrowLeftLine /> Back to home
        </Link>

        <div className="card">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <RiAdvertisementLine className="text-white text-xl" />
            </div>
            <span className="font-display text-xl font-semibold text-slate-900">AdPortal</span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Welcome back</h1>
          <p className="font-body text-slate-500 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/user/register" className="text-brand-600 hover:text-brand-700 font-semibold">Register free</Link>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="Email address" required className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                placeholder="Password" required className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><RiLoginBoxLine /> Sign In</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link to="/admin/login" className="text-xs font-body text-slate-400 hover:text-slate-600 transition-colors">
              Admin? Login here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
