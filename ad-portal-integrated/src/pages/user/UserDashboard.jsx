import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiAdvertisementLine, RiAddCircleLine, RiLogoutBoxLine,
  RiTimeLine, RiCheckboxCircleLine, RiCloseCircleLine,
  RiCalendarLine, RiFileList3Line, RiUser3Line, RiSpeedUpLine,
  RiEditLine, RiDeleteBinLine, RiCloseLine,
  RiGlobalLine, RiMoneyDollarCircleLine, RiAlertLine,
} from 'react-icons/ri';
import { adAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const STATUS_ICON = {
  pending:  <RiTimeLine className="text-amber-500" />,
  approved: <RiCheckboxCircleLine className="text-green-500" />,
  rejected: <RiCloseCircleLine className="text-red-500" />,
};

const STATUS_BADGE = {
  pending:  'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
};

// ── Ad Detail Modal ────────────────────────────────────────────────────────
function AdDetailModal({ ad, onClose, onEdit, onDelete }) {
  if (!ad) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-slate-900">{ad.title}</h3>
            <p className="font-body text-sm text-slate-500 mt-0.5">{ad.category}</p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl p-1 rounded-lg hover:bg-slate-100 transition-all">
            <RiCloseLine />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            {STATUS_ICON[ad.status]}
            <span className={STATUS_BADGE[ad.status]}>
              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
            </span>
          </div>

          {/* Description */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
            <p className="font-body text-sm text-slate-700 leading-relaxed">{ad.description}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Target Audience', val: ad.targetAudience },
              { label: 'Budget',          val: `₹${ad.budget}` },
              { label: 'Duration',        val: ad.duration },
              { label: 'Placement',       val: ad.placement },
              { label: 'Applied On',      val: new Date(ad.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                <p className="font-body text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="font-body text-sm font-semibold text-slate-800">{item.val || '—'}</p>
              </div>
            ))}
          </div>

          {/* Admin note */}
          {ad.adminNote && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
              <RiAlertLine className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-xs font-semibold text-amber-700 mb-1">Admin Note</p>
                <p className="font-body text-sm text-amber-800">{ad.adminNote}</p>
              </div>
            </div>
          )}

          {/* Website link */}
          {ad.website && (
            <a href={ad.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-600 text-sm font-body hover:underline">
              <RiGlobalLine /> {ad.website}
            </a>
          )}

          {/* Image */}
          {ad.imageUrl && (
            <img src={ad.imageUrl} alt="Ad"
              className="w-full rounded-xl object-cover max-h-48 border border-slate-100"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>

        {/* Actions — pending only */}
        {ad.status === 'pending' && (
          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={() => onEdit(ad._id)}
              className="flex-1 py-3 rounded-xl border-2 border-brand-200 text-brand-600 font-body font-semibold text-sm
                         hover:bg-brand-50 transition-all active:scale-95 flex items-center justify-center gap-2">
              <RiEditLine /> Edit Campaign
            </button>
            <button
              onClick={() => onDelete(ad._id)}
              className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-600 font-body font-semibold text-sm
                         hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2">
              <RiDeleteBinLine /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [ads, setAds]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState('');
  const [filter, setFilter]     = useState('all'); // all | pending | approved | rejected

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adAPI.getMyAds({ limit: 100 });
      setAds(data.ads || []);
    } catch {
      // silently ignore network errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleEdit = (adId) => {
    setSelected(null);
    navigate(`/user/edit/${adId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ad? This cannot be undone.')) return;
    try {
      await adAPI.delete(id);
      setSelected(null);
      showToast('🗑️ Ad deleted successfully.');
      load();
    } catch (err) {
      showToast('❌ ' + (err.message || 'Delete failed.'));
    }
  };

  const stats = {
    total:    ads.length,
    pending:  ads.filter((a) => a.status === 'pending').length,
    approved: ads.filter((a) => a.status === 'approved').length,
    rejected: ads.filter((a) => a.status === 'rejected').length,
  };

  const FILTERS = ['all', 'pending', 'approved', 'rejected'];

  const filtered = filter === 'all' ? ads : ads.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-slate-800 text-white rounded-xl shadow-2xl text-sm font-body animate-slide-in-right">
          {toast}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <AdDetailModal
          ad={selected}
          onClose={() => setSelected(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Topbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <RiAdvertisementLine className="text-white text-lg" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-slate-900 leading-none">AdPortal</p>
              <p className="font-body text-xs text-slate-400">User Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <RiUser3Line className="text-slate-400 text-sm" />
              <span className="font-body text-sm text-slate-600">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 text-sm font-body transition-colors">
              <RiLogoutBoxLine /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        {/* Welcome + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-semibold text-slate-900">
              Hello, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="font-body text-slate-500 text-sm mt-1">Here's an overview of your ad campaigns.</p>
          </div>
          <Link
            to="/user/apply"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl
                       font-body font-semibold text-sm transition-all active:scale-95 shadow-md shadow-brand-200">
            <RiAddCircleLine className="text-lg" /> Apply for New Ad
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Ads',  value: stats.total,    icon: <RiFileList3Line />,      color: 'bg-blue-50 text-blue-600',   key: 'all' },
            { label: 'Pending',    value: stats.pending,  icon: <RiTimeLine />,             color: 'bg-amber-50 text-amber-600', key: 'pending' },
            { label: 'Approved',   value: stats.approved, icon: <RiCheckboxCircleLine />,   color: 'bg-green-50 text-green-600', key: 'approved' },
            { label: 'Rejected',   value: stats.rejected, icon: <RiCloseCircleLine />,      color: 'bg-red-50 text-red-600',     key: 'rejected' },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setFilter(s.key)}
              className={`card flex items-center gap-4 text-left w-full transition-all hover:shadow-md
                ${filter === s.key ? 'ring-2 ring-brand-400' : ''}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900">{s.value}</p>
                <p className="font-body text-xs text-slate-500">{s.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Ads list */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="font-display text-2xl font-semibold text-slate-900">My Ad Campaigns</h2>

            {/* Filter tabs */}
            <div className="flex gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold capitalize transition-all
                    ${filter === f
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <span className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin inline-block" />
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16">
              <RiAdvertisementLine className="text-5xl text-slate-200 mx-auto mb-4" />
              <p className="font-body text-slate-400 mb-4">No ad campaigns yet.</p>
              <Link
                to="/user/apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl
                           font-body text-sm font-semibold hover:bg-brand-700 transition-all active:scale-95">
                <RiAddCircleLine /> Apply for Your First Ad
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <RiSpeedUpLine className="text-4xl text-slate-200 mx-auto mb-3" />
              <p className="font-body text-slate-400 text-sm">No <strong>{filter}</strong> ads found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((ad) => (
                <div
                  key={ad._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl
                             border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group">

                  {/* Left: icon + title */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 text-xl flex-shrink-0">{STATUS_ICON[ad.status]}</div>
                    <div className="min-w-0">
                      <p className="font-body font-semibold text-slate-800 text-sm truncate">{ad.title}</p>
                      <p className="font-body text-xs text-slate-500 mt-0.5">
                        {ad.category} · {ad.targetAudience} · ₹{ad.budget}
                      </p>
                    </div>
                  </div>

                  {/* Right: badge + date + actions */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className={STATUS_BADGE[ad.status]}>
                      {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                    </span>

                    <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs font-body">
                      <RiCalendarLine />
                      {new Date(ad.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      {/* View detail */}
                      <button
                        onClick={() => setSelected(ad)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
                        title="View details">
                        <RiFileList3Line className="text-base" />
                      </button>

                      {/* Edit — only pending */}
                      {ad.status === 'pending' && (
                        <button
                          onClick={() => handleEdit(ad._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
                          title="Edit campaign">
                          <RiEditLine className="text-base" />
                        </button>
                      )}

                      {/* Delete — only pending */}
                      {ad.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Delete campaign">
                          <RiDeleteBinLine className="text-base" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer count */}
          {!loading && ads.length > 0 && (
            <p className="font-body text-xs text-slate-400 text-center mt-6">
              Showing {filtered.length} of {ads.length} campaign{ads.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
