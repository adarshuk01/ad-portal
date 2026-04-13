import React from 'react';
import { Link } from 'react-router-dom';
import { RiAdvertisementLine, RiShieldUserLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 text-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <RiAdvertisementLine className="text-brand-400 text-2xl" />
          <span className="font-display text-2xl font-semibold tracking-tight">AdPortal</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/admin/login" className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm font-body transition-colors">
            <RiShieldUserLine /> Admin
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-brand-400 text-xs font-mono font-medium tracking-widest uppercase mb-6 bg-brand-400/10 px-3 py-1.5 rounded-full border border-brand-400/20">
            ✦ Advertisement Management Platform
          </p>

          <h1 className="font-display text-6xl md:text-8xl font-semibold leading-none tracking-tight mb-6">
            Advertise
            <br />
            <span className="text-brand-400">with Impact.</span>
          </h1>

          <p className="font-body text-slate-400 text-lg mb-12 max-w-xl leading-relaxed">
            Submit your ad campaign, track its approval status, and reach your audience — all through a single, elegant portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/user/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-body font-semibold text-sm transition-all duration-200 shadow-xl shadow-brand-900/50 hover:shadow-brand-700/40 active:scale-95"
            >
              Get Started Free <RiArrowRightLine className="text-lg" />
            </Link>
            <Link
              to="/user/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-2xl font-body font-semibold text-sm transition-all duration-200 active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mt-24 pt-12 border-t border-white/5">
          {[
            { icon: '01', title: 'Register & Login', desc: 'Create your account in seconds and access your personal ad dashboard.' },
            { icon: '02', title: 'Submit Your Ad', desc: 'Fill out a simple form with your campaign details, category, and target audience.' },
            { icon: '03', title: 'Get Approved', desc: 'Our admin team reviews and approves your ad. You get notified instantly.' },
          ].map((f) => (
            <div key={f.icon} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-mono text-brand-400 text-xs tracking-widest">{f.icon}</span>
              <h3 className="font-display text-xl font-semibold mt-3 mb-2">{f.title}</h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
