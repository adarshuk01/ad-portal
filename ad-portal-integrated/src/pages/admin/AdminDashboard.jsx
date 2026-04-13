import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiShieldUserLine, RiLogoutBoxLine, RiAdvertisementLine,
  RiCheckboxCircleLine, RiCloseCircleLine, RiTimeLine,
  RiUserLine, RiCalendarLine, RiMoneyDollarCircleLine,
  RiGlobalLine, RiRefreshLine, RiFilterLine, RiSearchLine,
  RiEyeLine, RiFileList3Line, RiBarChartBoxLine,
  RiUserSettingsLine, RiDeleteBinLine, RiToggleLine,
  RiCloseLine, RiAlertLine, RiCheckLine
} from 'react-icons/ri';
import { adAPI, userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected'];
const BADGE = {
  pending:  'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
};
const STATUS_ICON = {
  pending:  <RiTimeLine className="text-amber-500" />,
  approved: <RiCheckboxCircleLine className="text-green-500" />,
  rejected: <RiCloseCircleLine className="text-red-500" />,
};

// ── Ad Detail Modal ────────────────────────────────────────────────────────
function AdDetailModal({ ad, onClose, onApprove, onReject }) {
  const [note, setNote]     = useState('');
  const [loading, setLoading] = useState(false);

  if (!ad) return null;

  const handleAction = async (status) => {
    setLoading(true);
    await (status === 'approved' ? onApprove(ad._id, note) : onReject(ad._id, note));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-slate-900">{ad.title}</h3>
            <p className="font-body text-sm text-slate-500 mt-0.5">{ad.category}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl p-1"><RiCloseLine /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            {STATUS_ICON[ad.status]}
            <span className={BADGE[ad.status]}>{ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
            <p className="font-body text-sm text-slate-700 leading-relaxed">{ad.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <RiUserLine />,              label: 'Submitted by',   val: ad.user?.name || '—' },
              { icon: <RiFilterLine />,            label: 'Target Audience', val: ad.targetAudience },
              { icon: <RiMoneyDollarCircleLine />, label: 'Budget',         val: `₹${ad.budget}` },
              { icon: <RiCalendarLine />,          label: 'Duration',       val: ad.duration },
              { icon: <RiAdvertisementLine />,     label: 'Placement',      val: ad.placement },
              { icon: <RiCalendarLine />,          label: 'Applied On',     val: new Date(ad.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">{item.icon} {item.label}</div>
                <p className="font-body text-sm font-semibold text-slate-800">{item.val || '—'}</p>
              </div>
            ))}
          </div>

          {ad.website && (
            <a href={ad.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-600 text-sm font-body hover:underline">
              <RiGlobalLine /> {ad.website}
            </a>
          )}
          {ad.imageUrl && (
            <img src={ad.imageUrl} alt="Ad" className="w-full rounded-xl object-cover max-h-48 border border-slate-100"
              onError={(e) => e.target.style.display = 'none'} />
          )}

          {/* Admin note input for pending */}
          {ad.status === 'pending' && (
            <div>
              <label className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Admin Note (optional)
              </label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                placeholder="Add a note for the user (e.g. reason for rejection)…"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-body text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          )}

          {ad.adminNote && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-body text-xs font-semibold text-amber-700 mb-1">Admin Note</p>
              <p className="font-body text-sm text-amber-800">{ad.adminNote}</p>
            </div>
          )}
        </div>

        {ad.status === 'pending' && (
          <div className="p-6 pt-0 flex gap-3">
            <button disabled={loading} onClick={() => handleAction('rejected')}
              className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-600 font-body font-semibold text-sm
                         hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2">
              <RiCloseCircleLine /> Reject
            </button>
            <button disabled={loading} onClick={() => handleAction('approved')}
              className="flex-1 py-3 rounded-xl bg-green-600 text-white font-body font-semibold text-sm
                         hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              <RiCheckboxCircleLine /> Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────
function UsersTab({ showToast }) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userAPI.getAll({ limit: 100 });
      setUsers(data.users || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (id) => {
    try {
      const data = await userAPI.toggleStatus(id);
      showToast(`✅ User ${data.user.isActive ? 'activated' : 'deactivated'}.`);
      load();
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their ads? Cannot be undone.')) return;
    try {
      await userAPI.delete(id);
      showToast('🗑️ User deleted.');
      load();
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const filtered = users.filter((u) =>
    search === '' ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700
                     text-sm text-white placeholder-slate-500 font-body
                     focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <span className="w-8 h-8 border-4 border-brand-700 border-t-brand-400 rounded-full animate-spin inline-block" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <RiUserLine className="text-5xl text-slate-700 mx-auto mb-4" />
            <p className="font-body text-slate-500">No users found.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-700 bg-slate-900/50">
              {['Name', 'Email', 'Phone', 'Status', 'Joined', 'Actions'].map((h, i) => (
                <div key={h}
                  className={`font-body text-xs font-semibold text-slate-500 uppercase tracking-wider
                    ${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-3' : i === 5 ? 'col-span-2 text-right' : 'col-span-1'}`}>
                  {h}
                </div>
              ))}
            </div>
            <div className="divide-y divide-slate-700/50">
              {filtered.map((u) => (
                <div key={u._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-slate-700/30 transition-colors items-center">
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-900 flex items-center justify-center flex-shrink-0">
                      <RiUserLine className="text-brand-400 text-xs" />
                    </div>
                    <p className="font-body text-sm font-semibold text-white truncate">{u.name}</p>
                  </div>
                  <div className="hidden md:block md:col-span-3">
                    <p className="font-body text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <div className="hidden md:block md:col-span-1">
                    <p className="font-body text-xs text-slate-400">{u.phone || '—'}</p>
                  </div>
                  <div className="md:col-span-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold font-body
                      ${u.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {u.isActive ? <RiCheckLine /> : <RiAlertLine />}
                      {u.isActive ? 'Active' : 'Banned'}
                    </span>
                  </div>
                  <div className="hidden md:block md:col-span-1">
                    <p className="font-body text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </p>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                    <button onClick={() => toggleStatus(u._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all active:scale-95
                        ${u.isActive
                          ? 'border border-red-700 text-red-400 hover:bg-red-900/30'
                          : 'border border-green-700 text-green-400 hover:bg-green-900/30'}`}>
                      <RiToggleLine className="inline mr-1" />
                      {u.isActive ? 'Ban' : 'Activate'}
                    </button>
                    <button onClick={() => deleteUser(u._id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-all">
                      <RiDeleteBinLine className="text-base" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="font-body text-xs text-slate-600 text-center">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''} · AdPortal Admin
      </p>
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds]           = useState([]);
  const [stats, setStats]       = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState('');
  const [tab, setTab]           = useState('ads'); // 'ads' | 'users'
  const [loading, setLoading]   = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 200 };
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;
      const data = await adAPI.getAll(params);
      setAds(data.ads || []);
      if (data.stats) setStats(data.stats);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { if (tab === 'ads') load(); }, [load, tab]);

  const handleLogout = () => { logout(); navigate('/'); };

  const approve = async (id, adminNote = '') => {
    try {
      await adAPI.updateStatus(id, { status: 'approved', adminNote });
      load(); showToast('✅ Ad approved successfully.');
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const reject = async (id, adminNote = '') => {
    try {
      await adAPI.updateStatus(id, { status: 'rejected', adminNote });
      load(); showToast('❌ Ad rejected.');
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const resetStatus = async (id) => {
    try {
      await adAPI.updateStatus(id, { status: 'pending' });
      load(); showToast('🔄 Status reset to pending.');
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const deleteAd = async (id) => {
    if (!window.confirm('Delete this ad?')) return;
    try {
      await adAPI.delete(id);
      load(); showToast('🗑️ Ad deleted.');
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const filtered = ads.filter((a) => {
    const matchStatus = filter === 'all' || a.status === filter;
    const matchSearch = search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const navItems = [
    { key: 'ads',   icon: <RiBarChartBoxLine />, label: 'Ad Reviews' },
    { key: 'users', icon: <RiUserSettingsLine />, label: 'Users' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl
                        shadow-2xl font-body text-sm text-white animate-slide-in-right">
          {toast}
        </div>
      )}

      <AdDetailModal ad={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-6 flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <RiShieldUserLine className="text-white text-lg" />
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-none">AdPortal</p>
              <p className="font-body text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all
                  ${tab === item.key ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                <span className="text-base">{item.icon}</span> {item.label}
                {item.key === 'ads' && stats.pending > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">{stats.pending}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-900 flex items-center justify-center">
                <RiUserLine className="text-brand-400 text-sm" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-white leading-none">{user?.name}</p>
                <p className="font-body text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400
                         hover:bg-red-950/30 text-sm font-body transition-all">
              <RiLogoutBoxLine /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Topbar */}
          <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center flex-wrap justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold">
                {tab === 'ads' ? 'Ad Review Dashboard' : 'User Management'}
              </h1>
              <p className="font-body text-xs text-slate-500">
                {tab === 'ads' ? 'Review and manage submitted ad campaigns' : 'Manage registered user accounts'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile tab switcher */}
              <div className="flex  lg:hidden gap-1">
                {navItems.map((item) => (
                  <button key={item.key} onClick={() => setTab(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all
                      ${tab === item.key ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
              {tab === 'ads' && (
                <button onClick={load}
                  className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                  <RiRefreshLine />
                </button>
              )}
              <button onClick={handleLogout}
                className="lg:hidden flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-body transition-colors">
                <RiLogoutBoxLine />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 animate-fade-in">
            {/* Stats (ads tab only) */}
            {tab === 'ads' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Ads',  value: stats.total,    icon: <RiFileList3Line />,       color: 'text-blue-400',  bg: 'bg-blue-500/10' },
                  { label: 'Pending',    value: stats.pending,  icon: <RiTimeLine />,              color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { label: 'Approved',   value: stats.approved, icon: <RiCheckboxCircleLine />,    color: 'text-green-400', bg: 'bg-green-500/10' },
                  { label: 'Rejected',   value: stats.rejected, icon: <RiCloseCircleLine />,       color: 'text-red-400',   bg: 'bg-red-500/10' },
                ].map((s) => (
                  <div key={s.label}
                    className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.color} ${s.bg}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-display text-3xl font-semibold">{s.value}</p>
                      <p className="font-body text-xs text-slate-500">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADS TAB */}
            {tab === 'ads' && (
              <>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by title, user, or category…"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700
                                 text-sm text-white placeholder-slate-500 font-body
                                 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
                  </div>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button key={s} onClick={() => setFilter(s)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium capitalize transition-all
                          ${filter === s
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
                  {loading ? (
                    <div className="text-center py-16">
                      <span className="w-8 h-8 border-4 border-brand-700 border-t-brand-400 rounded-full animate-spin inline-block" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                      <RiAdvertisementLine className="text-5xl text-slate-700 mx-auto mb-4" />
                      <p className="font-body text-slate-500">
                        {ads.length === 0 ? 'No ads submitted yet.' : 'No ads match your filter.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-700 bg-slate-900/50">
                        {['Campaign', 'User', 'Category', 'Budget', 'Status', 'Date', 'Actions'].map((h, i) => (
                          <div key={h}
                            className={`font-body text-xs font-semibold text-slate-500 uppercase tracking-wider
                              ${i === 0 ? 'col-span-3' : i === 6 ? 'col-span-2 text-right' : 'col-span-1'}`}>
                            {h}
                          </div>
                        ))}
                      </div>
                      <div className="divide-y divide-slate-700/50">
                        {filtered.map((ad) => (
                          <div key={ad._id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4
                                       hover:bg-slate-700/30 transition-colors items-center">
                            <div className="md:col-span-3">
                              <p className="font-body font-semibold text-sm text-white truncate">{ad.title}</p>
                              <p className="font-body text-xs text-slate-500 md:hidden">{ad.user?.name} · {ad.category}</p>
                            </div>
                            <div className="hidden md:flex md:col-span-1 items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-brand-900 flex items-center justify-center flex-shrink-0">
                                <RiUserLine className="text-brand-400 text-xs" />
                              </div>
                              <p className="font-body text-xs text-slate-400 truncate">{ad.user?.name}</p>
                            </div>
                            <div className="hidden md:block md:col-span-1">
                              <p className="font-body text-xs text-slate-400 truncate">{ad.category}</p>
                            </div>
                            <div className="hidden md:block md:col-span-1">
                              <p className="font-mono text-xs text-slate-300">₹{ad.budget}</p>
                            </div>
                            <div className="md:col-span-1">
                              <span className={BADGE[ad.status]}>
                                {STATUS_ICON[ad.status]}
                                <span className="capitalize">{ad.status}</span>
                              </span>
                            </div>
                            <div className="hidden md:block md:col-span-1">
                              <p className="font-body text-xs text-slate-500">
                                {new Date(ad.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                              <button onClick={() => setSelected(ad)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                title="View details">
                                <RiEyeLine className="text-base" />
                              </button>
                              {ad.status === 'pending' && (
                                <>
                                  <button onClick={() => reject(ad._id)}
                                    className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-all"
                                    title="Reject">
                                    <RiCloseCircleLine className="text-base" />
                                  </button>
                                  <button onClick={() => approve(ad._id)}
                                    className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs
                                               font-body font-semibold transition-all active:scale-95 flex items-center gap-1">
                                    <RiCheckboxCircleLine /> Approve
                                  </button>
                                </>
                              )}
                              {ad.status !== 'pending' && (
                                <button onClick={() => resetStatus(ad._id)}
                                  className="px-2 py-1.5 rounded-lg border border-slate-600 text-slate-400
                                             hover:text-white hover:border-slate-400 text-xs font-body transition-all">
                                  Reset
                                </button>
                              )}
                              <button onClick={() => deleteAd(ad._id)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-all"
                                title="Delete ad">
                                <RiDeleteBinLine className="text-base" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <p className="font-body text-xs text-slate-600 text-center">
                  Showing {filtered.length} of {ads.length} ad submissions · AdPortal Admin v2.0
                </p>
              </>
            )}

            {/* USERS TAB */}
            {tab === 'users' && <UsersTab showToast={showToast} />}
          </div>
        </main>
      </div>
    </div>
  );
}
