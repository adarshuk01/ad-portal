import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: "What video format should I submit?", a: "We accept vertical 9:16 MP4 videos, up to 60 seconds long, at least 1080×1920px resolution. The first 3 seconds are most critical — make them count." },
    { q: "How long does approval take?", a: "Standard review is within 24 hours. Growth and Brand Deal plans get priority review in under 6 hours. You'll receive an email notification either way." },
    { q: "Can I target a specific audience?", a: "You can specify your preferred niche category (tech, fashion, food, fitness, etc.) and we'll match your ad to the most relevant Reels content in our catalog." },
    { q: "What analytics will I receive?", a: "You get a real-time dashboard showing views, saves, shares, comments, profile visits, and link clicks. Exported PDF reports available on Growth+ plans." },
    { q: "What if my ad gets rejected?", a: "We'll tell you exactly why and give you one free revision window. If we can't approve it after revision, you get a full refund — no questions asked." },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden relative font-sans">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes barB { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.7)} }
        .live-dot { animation: blink 1.4s infinite; }
        .pb { animation: barB 1.1s ease-in-out infinite; }
        .pb:nth-child(1){animation-delay:0s}
        .pb:nth-child(2){animation-delay:0.12s}
        .pb:nth-child(3){animation-delay:0.24s}
        .pb:nth-child(4){animation-delay:0.36s}
        .gtext {
          background: linear-gradient(100deg, #f9547a 0%, #c147c8 50%, #818cf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .gradient-text-pink {
          background: linear-gradient(90deg, #f9547a, #c147c8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .step-box:hover { background: rgba(255,255,255,0.03); }
        .test-card:hover { border-color: rgba(255,255,255,0.15) !important; }
        .price-card:hover { border-color: rgba(255,255,255,0.15) !important; }
      `}</style>

      {/* Noise */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 85% 5%,rgba(193,71,200,0.2) 0%,transparent 65%),radial-gradient(ellipse 50% 40% at 5% 90%,rgba(249,84,122,0.15) 0%,transparent 60%),radial-gradient(ellipse 40% 60% at 50% 40%,rgba(123,92,224,0.06) 0%,transparent 70%)' }} />

      {/* ─── NAV ─── */}
      <nav className="relative z-50 border-b border-white/[0.08]">
        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 sm:py-5">
          <div className="font-display font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[13px]"
              style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>▶</div>
            ReelAds
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['How it works','Pricing','Formats','FAQ'].map(l => (
              <span key={l} className="text-[13px] text-white/45 hover:text-white transition-colors cursor-pointer font-body">{l}</span>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-[5px] text-[10px] font-medium tracking-widest uppercase text-[#e879f9] px-[10px] py-1 rounded-full border border-[#e879f9]/25"
              style={{ background: 'rgba(232,121,249,0.1)' }}>
              <span className="live-dot w-[5px] h-[5px] rounded-full bg-[#e879f9]" />
              10M+ views
            </div>
            <button className="text-[13px] font-medium text-white px-[18px] py-2 rounded-[9px] border-none cursor-pointer font-body transition-opacity hover:opacity-85"
              style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>
              Get Started →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white/60 hover:text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-[1.5px] bg-current mb-1.5 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none' }} />
            <div className="w-5 h-[1.5px] bg-current mb-1.5 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
            <div className="w-5 h-[1.5px] bg-current transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.08] px-5 py-4 flex flex-col gap-4 bg-[#080810]">
            {['How it works','Pricing','Formats','FAQ'].map(l => (
              <span key={l} className="text-[14px] text-white/55 hover:text-white transition-colors cursor-pointer font-body py-1">{l}</span>
            ))}
            <button className="mt-2 text-[13px] font-medium text-white px-5 py-2.5 rounded-[9px] border-none cursor-pointer font-body w-full"
              style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>
              Get Started →
            </button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-10 lg:pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
            {['Instagram Reels Advertising','6K Followers · 10M Views'].map(t => (
              <span key={t} className="text-[10px] sm:text-[11px] font-medium tracking-[0.08em] uppercase text-white/40 px-[10px] py-1 rounded-[6px] border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>{t}</span>
            ))}
          </div>

          <h1 className="font-display font-extrabold leading-[1.02] tracking-[-2px] sm:tracking-[-3px] mb-5 sm:mb-6" style={{ fontSize: 'clamp(2.4rem,7vw,5rem)' }}>
            Reach millions<br />inside every<br /><span className="gtext">Reel they watch.</span>
          </h1>

          <p className="font-body text-[14px] sm:text-[15px] text-white/45 leading-[1.75] max-w-[460px] mb-8 sm:mb-10">
            Your brand, seamlessly embedded into authentic Reels content — seen by real, engaged viewers who are already in the scroll. No bots. No fake impressions. Just reach.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-12">
            <Link to="/user/register"
              className="font-body inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white px-6 sm:px-7 py-3.5 sm:py-[14px] rounded-[14px] border-none cursor-pointer transition-all hover:opacity-90 no-underline"
              style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>
              ▶ &nbsp;Submit Your Ad Campaign
            </Link>
            <Link to="/user/login"
              className="font-body inline-flex items-center justify-center gap-2 text-[14px] font-medium text-white/55 px-6 sm:px-7 py-3.5 sm:py-[14px] rounded-[14px] border border-white/15 cursor-pointer transition-all hover:text-white hover:border-white/40 no-underline bg-transparent">
              View Ad Formats →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 lg:gap-10 pt-6 sm:pt-8 border-t border-white/[0.08]">
            {[['10M+','Monthly Views'],['6K','Followers'],['~8s','Avg Watch Time'],['94%','View-Through Rate']].map(([n,l]) => (
              <div key={l}>
                <div className="font-display font-extrabold text-[1.4rem] sm:text-[1.6rem] gradient-text-pink">{n}</div>
                <div className="text-[11px] text-white/35 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone cluster — hidden on small, shown md+ */}
        <div className="relative hidden md:flex justify-center items-center h-[420px] lg:h-[480px]">
          <div className="absolute w-[300px] lg:w-[340px] h-[300px] lg:h-[340px] rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(ellipse,rgba(193,71,200,0.3),transparent 70%)' }} />

          {/* Left phone */}
          <div className="absolute w-[170px] lg:w-[200px] h-[330px] lg:h-[380px] rounded-[30px] lg:rounded-[34px] border border-white/10 overflow-hidden"
            style={{ transform: 'translateX(-100px) rotate(-8deg) scale(0.88)', opacity: 0.6, background: 'linear-gradient(160deg,#0a1a1e 0%,#0d2030 60%,#081018 100%)', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', zIndex: 2 }}>
            <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 25%,rgba(71,171,200,0.5),transparent 60%)' }} />
            <div className="relative z-10 p-3 text-[10px] text-white/70">▶ Reels</div>
            <div className="relative z-10 flex items-center justify-center mt-16">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px]" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)' }}>▶</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-4">
              <span className="inline-block text-[8px] font-semibold text-white px-1.5 py-0.5 rounded mb-1" style={{ background: 'rgba(249,84,122,0.9)' }}>SPONSORED</span>
              <div className="text-[10px] font-semibold text-white mb-0.5">@techstore</div>
              <div className="text-[9px] text-white/55">New drop just landed 🔥</div>
            </div>
          </div>

          {/* Main phone */}
          <div className="absolute w-[170px] lg:w-[200px] h-[330px] lg:h-[380px] rounded-[30px] lg:rounded-[34px] border border-white/10 overflow-hidden flex flex-col"
            style={{ transform: 'scale(1.1)', background: 'linear-gradient(160deg,#1e0a2e 0%,#0d1030 60%,#1a0818 100%)', boxShadow: '0 50px 100px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.05)', zIndex: 3 }}>
            <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 25%,rgba(193,71,200,0.5),transparent 60%),radial-gradient(ellipse 50% 40% at 30% 70%,rgba(249,84,122,0.4),transparent 60%)' }} />
            <div className="relative z-10 flex items-center justify-between px-3 pt-3 text-[10px] text-white/70">
              <span>▶ Reels</span>
              <div className="flex gap-[2px] items-end">
                {[7,12,9,5].map((h,i) => (
                  <div key={i} className="pb w-[2.5px] rounded-sm bg-white/60" style={{ height: h }} />
                ))}
              </div>
            </div>
            <div className="absolute right-[8px] top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
              {[['♡','142K'],['💬','3.2K'],['↗','Share'],['⊕','Save']].map(([icon,count]) => (
                <div key={count} className="flex flex-col items-center gap-[2px]">
                  <span className="text-[18px]">{icon}</span>
                  <span className="text-[8px] text-white/55">{count}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 relative z-10 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px]" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)' }}>▶</div>
            </div>
            <div className="relative z-10 px-3 pb-4">
              <span className="inline-block text-[8px] font-semibold text-white px-1.5 py-0.5 rounded mb-1" style={{ background: 'rgba(249,84,122,0.9)' }}>SPONSORED</span>
              <div className="text-[10px] font-semibold text-white mb-0.5">@yourbrand</div>
              <div className="text-[9px] text-white/55 leading-[1.4]">Your product in front of millions ↑</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px] bg-white/10">
              <div className="h-full w-[62%] rounded-sm" style={{ background: 'linear-gradient(90deg,#f9547a,#c147c8)' }} />
            </div>
          </div>

          {/* Right phone */}
          <div className="absolute w-[170px] lg:w-[200px] h-[330px] lg:h-[380px] rounded-[30px] lg:rounded-[34px] border border-white/10 overflow-hidden"
            style={{ transform: 'translateX(100px) rotate(8deg) scale(0.88)', opacity: 0.6, background: 'linear-gradient(160deg,#1e1a08 0%,#0d1a10 60%,#0a0818 100%)', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', zIndex: 2 }}>
            <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 25%,rgba(200,171,71,0.5),transparent 60%)' }} />
            <div className="relative z-10 p-3 text-[10px] text-white/70">▶ Reels</div>
            <div className="relative z-10 flex items-center justify-center mt-16">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px]" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)' }}>▶</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-4">
              <span className="inline-block text-[8px] font-semibold text-white px-1.5 py-0.5 rounded mb-1" style={{ background: 'rgba(249,84,122,0.9)' }}>SPONSORED</span>
              <div className="text-[10px] font-semibold text-white mb-0.5">@fashionlabel</div>
              <div className="text-[9px] text-white/55">Summer collection ☀️</div>
            </div>
          </div>
        </div>

        {/* Mobile: single phone preview */}
        <div className="md:hidden flex justify-center">
          <div className="relative w-[180px] h-[340px] rounded-[30px] border border-white/10 overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(160deg,#1e0a2e 0%,#0d1030 60%,#1a0818 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
            <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 25%,rgba(193,71,200,0.5),transparent 60%),radial-gradient(ellipse 50% 40% at 30% 70%,rgba(249,84,122,0.4),transparent 60%)' }} />
            <div className="relative z-10 flex items-center justify-between px-3 pt-3 text-[10px] text-white/70">
              <span>▶ Reels</span>
              <div className="flex gap-[2px] items-end">
                {[7,12,9,5].map((h,i) => <div key={i} className="pb w-[2.5px] rounded-sm bg-white/60" style={{ height: h }} />)}
              </div>
            </div>
            <div className="absolute right-[8px] top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
              {[['♡','142K'],['💬','3.2K'],['↗','Share']].map(([icon,count]) => (
                <div key={count} className="flex flex-col items-center gap-[2px]">
                  <span className="text-[16px]">{icon}</span>
                  <span className="text-[8px] text-white/55">{count}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 relative z-10 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px]" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)' }}>▶</div>
            </div>
            <div className="relative z-10 px-3 pb-4">
              <span className="inline-block text-[8px] font-semibold text-white px-1.5 py-0.5 rounded mb-1" style={{ background: 'rgba(249,84,122,0.9)' }}>SPONSORED</span>
              <div className="text-[10px] font-semibold text-white mb-0.5">@yourbrand</div>
              <div className="text-[9px] text-white/55">Your product in front of millions ↑</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px] bg-white/10">
              <div className="h-full w-[62%] rounded-sm" style={{ background: 'linear-gradient(90deg,#f9547a,#c147c8)' }} />
            </div>
          </div>
        </div>
      </section>

      <div className="h-px mx-5 sm:mx-8 lg:mx-12 bg-white/[0.08]" />

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#c147c8] mb-4">Process</div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
          <h2 className="font-display font-extrabold tracking-[-1.5px] leading-[1.1]" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
            How your ad<br />goes live in Reels
          </h2>
          <p className="font-body text-[14px] text-white/40 leading-[1.7] sm:max-w-[380px] lg:max-w-[520px]">
            From submission to live placement — our streamlined process gets your brand in front of viewers in hours, not weeks.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-[20px] overflow-hidden border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.08)' }}>
          {[
            { n:'01', icon:'◎', t:'Create Account',  d:"Sign up free. Set up your advertiser profile with your brand details and billing info in under 2 minutes.", arrow: true },
            { n:'02', icon:'◈', t:'Submit Creative', d:"Upload your video, caption, CTA, and target audience. We accept vertical 9:16 video up to 60 seconds.", arrow: true },
            { n:'03', icon:'◉', t:'Get Reviewed',    d:"Our team reviews content within 24 hours for brand safety and quality. You'll be notified by email instantly.", arrow: true },
            { n:'04', icon:'⊕', t:'Go Live & Track', d:"Your ad runs in Reels and you see live metrics — views, engagement, click-throughs, and reach — all in your dashboard.", arrow: false },
          ].map(({ n, icon, t, d, arrow }) => (
            <div key={n} className="step-box relative bg-[#080810] p-6 sm:p-8 transition-colors duration-200">
              <div className="font-display font-extrabold text-[2.5rem] opacity-[0.07] leading-none mb-4">{n}</div>
              <div className="w-10 h-10 rounded-[12px] bg-white/5 border border-white/[0.08] flex items-center justify-center text-[18px] mb-4">{icon}</div>
              <div className="font-display font-bold text-[15px] mb-2">{t}</div>
              <div className="font-body text-[12px] text-white/38 leading-[1.6]">{d}</div>
              {arrow && <div className="absolute top-6 right-6 text-[18px] text-white/12 hidden lg:block">→</div>}
            </div>
          ))}
        </div>
      </section>

      <div className="h-px mx-5 sm:mx-8 lg:mx-12 bg-white/[0.08]" />

      {/* ─── REACH ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#c147c8] mb-4">Audience</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="font-display font-extrabold tracking-[-1.5px] leading-[1.1]" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
              Real reach.<br />Real engagement.
            </h2>
            <p className="font-body text-[14px] text-white/40 leading-[1.7] mt-4 mb-6 sm:mb-8">
              Every view on this channel is organic. No bought followers, no inflated numbers — just a loyal, active audience who actually watches.
            </p>
            <div className="flex flex-col gap-3">
              {['Verified organic traffic only','18–34 age demographic, high purchase intent','Niche-targeted placement by category','Full campaign analytics dashboard'].map(item => (
                <div key={item} className="flex items-center gap-2.5 font-body text-[13px] text-white/55">
                  <span className="text-[#c147c8] text-[16px] flex-shrink-0">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 rounded-[16px] p-5 sm:p-6 border" style={{ background: 'linear-gradient(135deg,rgba(193,71,200,0.1),rgba(249,84,122,0.06))', borderColor: 'rgba(193,71,200,0.2)' }}>
              <div className="text-[24px] sm:text-[28px] mb-2">📱</div>
              <div className="font-display font-extrabold text-[1.8rem] sm:text-[2rem] gradient-text-pink">10M+</div>
              <div className="font-body text-[12px] text-white/40 mt-1">Monthly Reel Views</div>
            </div>
            {[['94%','View-through rate'],['6K','Active followers'],['~8s','Avg watch time'],['3.2K','Avg comments/post']].map(([n,l]) => (
              <div key={l} className="rounded-[16px] p-4 sm:p-6 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="font-display font-extrabold text-[1.6rem] sm:text-[2rem] gradient-text-pink">{n}</div>
                <div className="font-body text-[11px] sm:text-[12px] text-white/40 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px mx-5 sm:mx-8 lg:mx-12 bg-white/[0.08]" />

      {/* ─── FORMATS ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#c147c8] mb-4">Ad Formats</div>
        <h2 className="font-display font-extrabold tracking-[-1.5px] leading-[1.1] mb-2" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>Choose your format</h2>
        <p className="font-body text-[14px] text-white/40 leading-[1.7] mb-8 sm:mb-10">Every format is optimized for Reels' vertical full-screen experience.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { accent: 'linear-gradient(90deg,#f9547a,#c147c8)', icon: '▶', t: 'Native Reel Ad', d: 'Your video plays natively within the Reel feed. Viewers can like, comment, share. Feels organic, not intrusive.', tag: 'Most Popular', tagColor: '#f9547a', tagBg: 'rgba(249,84,122,0.1)', tagBorder: 'rgba(249,84,122,0.2)' },
            { accent: 'linear-gradient(90deg,#7b5ce0,#818cf8)', icon: '📌', t: 'Pinned Story Slot', d: 'Your ad is pinned in the story highlight for 24 hours — guaranteed top-of-feed visibility to all profile visitors.', tag: 'High Visibility', tagColor: '#818cf8', tagBg: 'rgba(123,92,224,0.1)', tagBorder: 'rgba(123,92,224,0.2)' },
            { accent: 'linear-gradient(90deg,#f97316,#facc15)', icon: '🔗', t: 'Caption + Link Drop', d: 'Brand mention and link placed in a Reel caption or comment pinned by the creator. Great for driving traffic.', tag: 'Traffic Driver', tagColor: '#fb923c', tagBg: 'rgba(249,115,22,0.1)', tagBorder: 'rgba(249,115,22,0.2)' },
          ].map(({ accent, icon, t, d, tag, tagColor, tagBg, tagBorder }) => (
            <div key={t} className="rounded-[16px] p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />
              <div className="text-[2rem] mb-4">{icon}</div>
              <div className="font-display font-bold text-[15px] mb-1.5">{t}</div>
              <div className="font-body text-[12px] text-white/38 leading-[1.6]">{d}</div>
              <div className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-[6px] mt-3 border" style={{ color: tagColor, background: tagBg, borderColor: tagBorder }}>{tag}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px mx-5 sm:mx-8 lg:mx-12 bg-white/[0.08]" />

      {/* ─── PRICING ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#c147c8] mb-4">Pricing</div>
        <h2 className="font-display font-extrabold tracking-[-1.5px] leading-[1.1] mb-2" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>Simple, transparent pricing</h2>
        <p className="font-body text-[14px] text-white/40 leading-[1.7] mb-8 sm:mb-10">No hidden fees. Pay per campaign. Cancel anytime.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="price-card rounded-[20px] p-6 sm:p-8 border border-white/[0.08] transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="font-body text-[12px] font-medium tracking-[0.1em] uppercase text-white/40 mb-4">Starter</div>
            <div className="font-display font-extrabold text-[2.4rem] sm:text-[2.8rem] tracking-[-2px] leading-none mb-1">₹4,999</div>
            <div className="font-body text-[12px] text-white/35 mb-6">per campaign</div>
            <div className="flex flex-col gap-2.5 mb-8">
              {['1 Native Reel Ad','Up to 500K reach','7-day campaign window','Basic analytics report'].map(f => (
                <div key={f} className="flex items-center gap-2 font-body text-[13px] text-white/60">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 border" style={{ background: 'rgba(193,71,200,0.2)', borderColor: 'rgba(193,71,200,0.4)', color: '#c147c8' }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-[10px] text-[13px] font-medium font-body cursor-pointer transition-all border border-white/15 bg-transparent text-white/60 hover:border-white/35 hover:text-white">Get Started</button>
          </div>

          <div className="price-card rounded-[20px] p-6 sm:p-8 border relative transition-colors duration-200" style={{ borderColor: 'rgba(193,71,200,0.5)', background: 'linear-gradient(145deg,rgba(193,71,200,0.08),rgba(249,84,122,0.05))' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.08em] uppercase text-white px-[14px] py-1 rounded-full whitespace-nowrap" style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>Most Popular</div>
            <div className="font-body text-[12px] font-medium tracking-[0.1em] uppercase text-white/40 mb-4">Growth</div>
            <div className="font-display font-extrabold text-[2.4rem] sm:text-[2.8rem] tracking-[-2px] leading-none mb-1 gtext">₹12,999</div>
            <div className="font-body text-[12px] text-white/35 mb-6">per campaign</div>
            <div className="flex flex-col gap-2.5 mb-8">
              {['3 Native Reel Ads','Up to 3M reach','21-day campaign window','Full analytics dashboard','Priority review (6 hrs)','Pinned story slot included'].map(f => (
                <div key={f} className="flex items-center gap-2 font-body text-[13px] text-white/60">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 border" style={{ background: 'rgba(193,71,200,0.2)', borderColor: 'rgba(193,71,200,0.4)', color: '#c147c8' }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-[10px] text-[13px] font-medium font-body cursor-pointer transition-all border-none text-white" style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>Get Started →</button>
          </div>

          <div className="price-card rounded-[20px] p-6 sm:p-8 border border-white/[0.08] transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="font-body text-[12px] font-medium tracking-[0.1em] uppercase text-white/40 mb-4">Brand Deal</div>
            <div className="font-display font-extrabold text-[2.4rem] sm:text-[2.8rem] tracking-[-2px] leading-none mb-1">Custom</div>
            <div className="font-body text-[12px] text-white/35 mb-6">monthly partnership</div>
            <div className="flex flex-col gap-2.5 mb-8">
              {['Unlimited campaigns','Full 10M+ reach','Dedicated account manager','All formats included','Co-created content option'].map(f => (
                <div key={f} className="flex items-center gap-2 font-body text-[13px] text-white/60">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 border" style={{ background: 'rgba(193,71,200,0.2)', borderColor: 'rgba(193,71,200,0.4)', color: '#c147c8' }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-[10px] text-[13px] font-medium font-body cursor-pointer transition-all border border-white/15 bg-transparent text-white/60 hover:border-white/35 hover:text-white">Contact Us</button>
          </div>
        </div>
      </section>

      <div className="h-px mx-5 sm:mx-8 lg:mx-12 bg-white/[0.08]" />

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#c147c8] mb-4">Social Proof</div>
        <h2 className="font-display font-extrabold tracking-[-1.5px] leading-[1.1] mb-8 sm:mb-10" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>Brands that went live</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stars: '★★★★★', q: '"We ran a 7-day Reel campaign and got 400K views on our product launch video. The approval was fast and the results were insane for the price."', initials: 'AK', name: 'Arjun K.', handle: '@arjundrops · Streetwear Brand', avatarBg: 'rgba(249,84,122,0.15)', avatarColor: '#f9547a' },
            { stars: '★★★★★', q: "\"The native format is the key. Our ad didn't feel like an ad — it matched the vibe of the Reels feed perfectly. CTR was 3x higher than Meta ads.\"", initials: 'SN', name: 'Sneha N.', handle: '@snehacooks · D2C Food Brand', avatarBg: 'rgba(193,71,200,0.15)', avatarColor: '#c147c8' },
            { stars: '★★★★☆', q: '"Submitted on Monday, approved by Tuesday, live by Wednesday. The dashboard shows real-time views and saves. Transparent and professional."', initials: 'RM', name: 'Rahul M.', handle: '@rahultechgear · Electronics', avatarBg: 'rgba(123,92,224,0.15)', avatarColor: '#7b5ce0' },
          ].map(({ stars, q, initials, name, handle, avatarBg, avatarColor }) => (
            <div key={name} className="test-card rounded-[18px] p-5 sm:p-6 border border-white/[0.08] transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-[#f9547a] text-[13px] mb-4">{stars}</div>
              <p className="font-body text-[13px] text-white/55 leading-[1.65] mb-5">{q}</p>
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0" style={{ background: avatarBg, color: avatarColor }}>{initials}</div>
                <div>
                  <div className="font-body text-[13px] font-semibold">{name}</div>
                  <div className="font-body text-[11px] text-white/35">{handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px mx-5 sm:mx-8 lg:mx-12 bg-white/[0.08]" />

      {/* ─── FAQ ─── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div>
            <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#c147c8] mb-4">FAQ</div>
            <h2 className="font-display font-extrabold tracking-[-1.5px] leading-[1.1] mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>Questions?<br />We got you.</h2>
            <p className="font-body text-[14px] text-white/40 leading-[1.7]">Everything you need to know before submitting your first Reel ad campaign.</p>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-white/[0.08] py-4 sm:py-5 cursor-pointer last:border-b last:border-white/[0.08]" onClick={() => toggleFaq(i)}>
                <div className="flex items-center justify-between font-body text-[13px] sm:text-[14px] font-medium">
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-[18px] flex-shrink-0 transition-transform duration-200" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none', color: openFaq === i ? '#c147c8' : 'rgba(255,255,255,0.3)' }}>+</span>
                </div>
                {openFaq === i && (
                  <p className="font-body text-[13px] text-white/45 leading-[1.7] mt-3">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <div className="relative z-10 mx-5 sm:mx-8 lg:mx-12 mb-12 sm:mb-16 rounded-[20px] sm:rounded-[24px] overflow-hidden p-10 sm:p-16 text-center border" style={{ background: 'linear-gradient(135deg,#1a0826,#0d1030,#1a0812)', borderColor: 'rgba(193,71,200,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(193,71,200,0.2),transparent 70%)' }} />
        <h2 className="relative z-10 font-display font-extrabold tracking-[-2px] mb-4" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)' }}>
          Ready to go live<br /><span className="gtext">in the Reel?</span>
        </h2>
        <p className="relative z-10 font-body text-[14px] sm:text-[15px] text-white/45 mb-8">Join brands already reaching millions of real viewers — start your campaign today.</p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/user/register" className="font-body inline-flex items-center justify-center gap-2 text-[14px] sm:text-[15px] font-semibold text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-[14px] border-none cursor-pointer transition-all hover:opacity-90 no-underline" style={{ background: 'linear-gradient(135deg,#f9547a,#c147c8)' }}>
            ▶ &nbsp;Submit Your Ad Now
          </Link>
          <Link to="/user/login" className="font-body inline-flex items-center justify-center gap-2 text-[14px] sm:text-[15px] font-medium text-white/55 px-7 sm:px-8 py-3.5 sm:py-4 rounded-[14px] border border-white/15 cursor-pointer transition-all hover:text-white hover:border-white/40 no-underline bg-transparent">
            View Pricing →
          </Link>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.08] px-5 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-[12px] text-white/25">
        <span>© 2025 ReelAds. All rights reserved.</span>
        <div className="flex gap-6">
          {['Privacy','Terms','Contact'].map(l => <span key={l} className="cursor-pointer hover:text-white/60 transition-colors">{l}</span>)}
        </div>
      </footer>
    </div>
  );
}