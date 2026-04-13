import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  RiArrowLeftLine, RiSaveLine, RiAlertLine, RiCheckboxCircleLine,
  RiTimeLine, RiEyeLine, RiEditLine, RiGlobalLine,
} from 'react-icons/ri';
import { adAPI } from '../../api';
import AdCampaignForm from './Adcampaignform';

const STEP_LABELS = ['Campaign Details', 'Budget & Placement', 'Review & Save'];

// Build FormData for update — always multipart so the backend
// consistently receives the same content-type regardless of whether
// an image was changed.
function buildFormData(form) {
  const fd = new FormData();
  fd.append('title',          form.title);
  fd.append('category',       form.category);
  fd.append('description',    form.description);
  fd.append('targetAudience', form.targetAudience);
  fd.append('budget',         Number(form.budget));
  fd.append('duration',       form.duration);
  fd.append('placement',      form.placement);
  if (form.website)   fd.append('website', form.website);
  // Only append 'image' when the user actually picked a new file.
  // If imageFile is null the old Cloudinary URL is untouched on the backend.
  if (form.imageFile) fd.append('image', form.imageFile);
  return fd;
}

export default function EditAd() {
  const { id } = useParams();

  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState(null);
  const [originalAd, setOriginalAd] = useState(null);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [fetchErr, setFetchErr]     = useState('');
  const [saved, setSaved]           = useState(false);
  const [saveErr, setSaveErr]       = useState('');

  useEffect(() => {
    adAPI.getById(id)
      .then(({ ad }) => {
        setOriginalAd(ad);
        setForm({
          title:          ad.title,
          category:       ad.category,
          description:    ad.description,
          targetAudience: ad.targetAudience,
          budget:         String(ad.budget),
          duration:       ad.duration,
          placement:      ad.placement,
          imageFile:      null,             // no new file yet
          imageUrl:       ad.imageUrl || '', // existing Cloudinary URL for preview
          website:        ad.website  || '',
        });
      })
      .catch((err) => setFetchErr(err.response?.data?.message || err.message || 'Failed to load ad.'));
  }, [id]);

  const submit = async () => {
    setSaveErr('');
    setLoading(true);
    try {
      await adAPI.update(id, buildFormData(form));
      setSaved(true);
    } catch (err) {
      setSaveErr(err.response?.data?.message || err.message || 'Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  // ── Loading / error states ────────────────────────────────────────────────
  if (fetchErr) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center">
        <RiAlertLine className="text-4xl text-red-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">Could not load ad</h2>
        <p className="font-body text-slate-500 text-sm mb-6">{fetchErr}</p>
        <Link to="/user/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
          <RiArrowLeftLine /> Back to Dashboard
        </Link>
      </div>
    </div>
  );

  if (!form) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <span className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );

  if (originalAd?.status !== 'pending') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center">
        <RiAlertLine className="text-4xl text-amber-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">Can't edit this ad</h2>
        <p className="font-body text-slate-500 text-sm mb-6">
          Only <strong>pending</strong> ads can be edited. This ad is currently <strong>{originalAd?.status}</strong>.
        </p>
        <Link to="/user/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
          <RiArrowLeftLine /> Back to Dashboard
        </Link>
      </div>
    </div>
  );

  if (saved) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <RiCheckboxCircleLine className="text-4xl text-green-600" />
        </div>
        <h2 className="font-display text-3xl font-semibold text-slate-900 mb-2">Changes Saved!</h2>
        <p className="font-body text-slate-500 text-sm mb-8">
          Your ad <strong>"{form.title}"</strong> has been updated and is still pending review.
        </p>
        <Link to="/user/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/user/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-body transition-colors">
            <RiArrowLeftLine /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <RiEditLine className="text-brand-600 text-xl" />
            <span className="font-display text-lg font-semibold text-slate-900">Edit Ad Campaign</span>
          </div>
          <div className="text-xs font-body text-slate-400">Step {step} of 3</div>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-brand-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="max-w-3xl mx-auto px-6 py-2 flex justify-between">
          {STEP_LABELS.map((label, i) => (
            <span key={label}
              className={`font-body text-xs transition-colors ${step === i + 1 ? 'text-brand-600 font-semibold' : 'text-slate-400'}`}>
              {label}
            </span>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 animate-slide-up">

        {/* Steps 1 & 2 — shared form */}
        {step < 3 && (
          <AdCampaignForm
            form={form} setForm={setForm}
            step={step}
            errors={errors} setErrors={setErrors}
            onBack={() => setStep(1)}
            onNext={step === 1 ? () => setStep(2) : () => setStep(3)}
            nextLabel="Review Changes →"
          />
        )}

        {/* Step 3 — Review & Save */}
        {step === 3 && (
          <div>
            <h1 className="font-display text-4xl font-semibold text-slate-900 mb-1">Review & Save</h1>
            <p className="font-body text-slate-500 text-sm mb-8">Check everything looks right before saving.</p>

            {saveErr && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-body flex items-center gap-2">
                <RiAlertLine /> {saveErr}
              </div>
            )}

            <div className="mb-4 flex items-center gap-2.5 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <RiTimeLine className="text-amber-500 text-lg flex-shrink-0" />
              <p className="font-body text-sm text-amber-800">
                This ad will <strong>remain pending</strong> after saving and will need admin review.
              </p>
            </div>

            <div className="card space-y-4">
              {/* Campaign Details */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-body text-sm font-semibold text-slate-700 uppercase tracking-wider">Campaign Details</h3>
                <button onClick={() => setStep(1)} className="text-xs text-brand-600 hover:text-brand-700 font-body flex items-center gap-1">
                  <RiEditLine /> Edit
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Title',           val: form.title },
                  { label: 'Category',        val: form.category },
                  { label: 'Target Audience', val: form.targetAudience },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-body text-xs text-slate-400 mb-1">{item.label}</p>
                    <p className="font-body text-sm font-semibold text-slate-800">{item.val}</p>
                  </div>
                ))}
                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                  <p className="font-body text-xs text-slate-400 mb-1">Description</p>
                  <p className="font-body text-sm text-slate-700 leading-relaxed">{form.description}</p>
                </div>
              </div>

              {/* Budget & Placement */}
              <div className="flex items-center justify-between pt-2 pb-3 border-b border-slate-100">
                <h3 className="font-body text-sm font-semibold text-slate-700 uppercase tracking-wider">Budget & Placement</h3>
                <button onClick={() => setStep(2)} className="text-xs text-brand-600 hover:text-brand-700 font-body flex items-center gap-1">
                  <RiEditLine /> Edit
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'Budget',    val: `₹${form.budget}` },
                  { label: 'Duration',  val: form.duration },
                  { label: 'Placement', val: form.placement },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-body text-xs text-slate-400 mb-1">{item.label}</p>
                    <p className="font-body text-sm font-semibold text-slate-800">{item.val}</p>
                  </div>
                ))}
              </div>

              {/* Website */}
              {form.website && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-body text-xs text-slate-400 mb-1 flex items-center gap-1"><RiGlobalLine /> Website</p>
                  <a href={form.website} target="_blank" rel="noopener noreferrer"
                    className="font-body text-xs text-brand-600 hover:underline truncate block">{form.website}</a>
                </div>
              )}

              {/* Image preview — new file takes priority over existing URL */}
              {(form.imageFile || form.imageUrl) && (
                <div>
                  <p className="font-body text-xs text-slate-400 mb-2 flex items-center gap-1">
                    <RiEyeLine /> Image Preview
                    {form.imageFile && <span className="text-brand-500 ml-1">· New upload</span>}
                  </p>
                  <img
                    src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.imageUrl}
                    alt="Ad preview"
                    className="w-full object-cover rounded-xl border border-slate-100"
                    style={{ aspectRatio: '1792 / 512' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="btn-secondary w-auto px-6">← Back</button>
                <button onClick={submit} disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <><RiSaveLine /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}