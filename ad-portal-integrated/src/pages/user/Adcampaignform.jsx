// AdCampaignForm.jsx — shared form for ApplyAd & EditAd (steps 1 & 2)
import React, { useRef, useState, useCallback } from 'react';
import {
  RiAdvertisementLine, RiFileTextLine, RiPriceTag3Line, RiGroupLine,
  RiGlobalLine, RiMoneyDollarCircleLine, RiImageLine, RiCalendarLine,
  RiAlignItemLeftLine, RiAlertLine, RiUploadCloud2Line, RiCloseLine,
  RiCheckLine, RiInformationLine,
} from 'react-icons/ri';

export const CATEGORIES = [
  'Technology', 'Fashion', 'Food & Beverage', 'Health & Wellness',
  'Real Estate', 'Education', 'Travel', 'Finance', 'Entertainment',
  'Automotive', 'Other',
];
export const AUDIENCES = [
  'General Public', 'Young Adults (18-25)', 'Professionals (25-45)',
  'Senior Citizens (55+)', 'Parents & Families', 'Students', 'Business Owners',
];
export const DURATIONS  = ['7 days', '14 days', '30 days', '60 days', '90 days'];
export const PLACEMENTS = ['In Instagram Reels'];

// ── Validation ─────────────────────────────────────────────────────────────
export function validateStep1(form) {
  const errs = {};
  if (!form.title.trim())               errs.title          = 'Campaign title is required.';
  else if (form.title.length < 3)       errs.title          = 'Title must be at least 3 characters.';
  if (!form.category)                   errs.category       = 'Please select a category.';
  if (!form.description.trim())         errs.description    = 'Description is required.';
  else if (form.description.length < 10) errs.description   = 'Description must be at least 10 characters.';
  if (!form.targetAudience)             errs.targetAudience = 'Please select a target audience.';
  return errs;
}

export function validateStep2(form) {
  const errs = {};
  if (!form.budget || Number(form.budget) < 1) errs.budget   = 'Budget must be at least ₹1.';
  if (!form.duration)                          errs.duration  = 'Please select a duration.';
  if (!form.placement)                         errs.placement = 'Please select a placement.';
  if (form.imageFile && form.imageFile.size > 5 * 1024 * 1024) errs.imageFile = 'Image must be under 5 MB.';
  if (form.website && !/^https?:\/\/.+/.test(form.website))    errs.website   = 'Must be a valid URL starting with http/https.';
  return errs;
}

// ── Inline field error ─────────────────────────────────────────────────────
export function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-red-500 font-body flex items-center gap-1">
      <RiAlertLine />{msg}
    </p>
  );
}

// ── Empty form state ───────────────────────────────────────────────────────
export const EMPTY_FORM = {
  title: '', category: '', description: '', targetAudience: '',
  budget: '', duration: '', placement: '',
  imageFile: null,   // File object from upload
  imageUrl:  '',     // existing URL (EditAd only — populated from server)
  website:   '',
};

// ── Image Uploader ─────────────────────────────────────────────────────────
// Recommended render size: 1792 × 512 px (3.5 : 1 banner ratio)
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_MB  = 5;

function formatBytes(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImageUploader({ file, existingUrl, onChange, error, onClearError }) {
  const inputRef  = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Preview source: new file > existing server URL
  const previewSrc = file
    ? URL.createObjectURL(file)
    : existingUrl || null;

  const processFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return;
    onClearError();
    onChange(f);
  }, [onChange, onClearError]);

  const onInputChange = (e) => processFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    onChange(null);
    onClearError();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
        <RiImageLine className="text-brand-500" /> Ad Image
        <span className="text-slate-400 font-normal">(optional)</span>
      </label>

      {/* Resolution hint */}
      <p className="font-body text-xs text-slate-400 mb-2 flex flex-wrap items-center gap-1">
        <RiInformationLine className="text-brand-400 flex-shrink-0" />
        Recommended resolution: <strong className="text-slate-500">1792 × 512 px</strong> &nbsp;·&nbsp; Banner ratio (3.5 : 1) &nbsp;·&nbsp; JPG, PNG, WebP &nbsp;·&nbsp; Max {MAX_MB} MB
      </p>

      {/* Drop zone */}
      {!previewSrc ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
            transition-all px-6 py-10
            ${dragging
              ? 'border-brand-500 bg-brand-50'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/40'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center
            ${dragging ? 'bg-brand-100' : 'bg-white border border-slate-200'}`}>
            <RiUploadCloud2Line className={`text-2xl ${dragging ? 'text-brand-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-center">
            <p className="font-body text-sm font-semibold text-slate-700">
              {dragging ? 'Drop it here!' : 'Drag & drop your image'}
            </p>
            <p className="font-body text-xs text-slate-400 mt-0.5">
              or <span className="text-brand-600 underline underline-offset-2">browse files</span>
            </p>
          </div>
          <input
            ref={inputRef} type="file" accept={ACCEPT}
            className="hidden" onChange={onInputChange}
          />
        </div>
      ) : (
        /* Preview — mimics the 1792×512 banner aspect ratio */
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={previewSrc} alt="Ad preview"
            className="w-full object-cover"
            style={{ aspectRatio: '1792 / 512' }}
          />
          {/* Overlay bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between
            px-3 py-2 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <RiCheckLine className="text-green-400 flex-shrink-0" />
              <span className="font-body text-xs text-white truncate">
                {file ? `${file.name} · ${formatBytes(file.size)}` : 'Existing image'}
              </span>
            </div>
            <button
              type="button" onClick={clear}
              className="flex-shrink-0 ml-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40
                flex items-center justify-center transition-colors"
              title="Remove image">
              <RiCloseLine className="text-white text-sm" />
            </button>
          </div>
        </div>
      )}

      {error && <FieldError msg={error} />}
    </div>
  );
}


//  *
//  * Props:
//  *   form          {object}   – current form values
//  *   setForm       {fn}       – setter for form
//  *   step          {1|2}      – current step (1 or 2)
//  *   errors        {object}   – field-level errors
//  *   setErrors     {fn}       – setter for errors
//  *   onBack        {fn}       – called when Back is clicked on step 2
//  *   onNext        {fn}       – called when Continue/final CTA is clicked (after validation passes)
//  *   loading       {bool}     – disables the CTA button on step 2
//  *   nextLabel     {string}   – CTA label for step 2 (e.g. "Review Changes →" or "Submit Ad Campaign")
//  *   nextIcon      {node}     – optional icon for the step 2 CTA
//  */
export default function AdCampaignForm({
  form, setForm,
  step,
  errors, setErrors,
  onBack, onNext,
  loading = false,
  nextLabel = 'Continue →',
  nextIcon = null,
}) {
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const setPlacement = (p) => {
    setForm({ ...form, placement: p });
    if (errors.placement) setErrors({ ...errors, placement: '' });
  };

  const handleNext = () => {
    const errs = step === 1 ? validateStep1(form) : validateStep2(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onNext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    onBack();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Step 1 ───────────────────────────────────────────────────────────────
  if (step === 1) return (
    <div>
      <h1 className="font-display text-4xl font-semibold text-slate-900 mb-1">Campaign Details</h1>
      <p className="font-body text-slate-500 text-sm mb-8">Tell us about your ad campaign.</p>

      <div className="card space-y-5">
        {/* Title */}
        <div>
          <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <RiFileTextLine className="text-brand-500" /> Campaign Title *
          </label>
          <input
            name="title" value={form.title} onChange={handle}
            placeholder="e.g. Summer Sale 2025"
            className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-400' : ''}`}
          />
          <FieldError msg={errors.title} />
        </div>

        {/* Category */}
        <div>
          <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <RiPriceTag3Line className="text-brand-500" /> Category *
          </label>
          <select
            name="category" value={form.category} onChange={handle}
            className={`input-field ${errors.category ? 'border-red-300 focus:ring-red-400' : ''}`}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <FieldError msg={errors.category} />
        </div>

        {/* Description */}
        <div>
          <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <RiAlignItemLeftLine className="text-brand-500" /> Campaign Description *
          </label>
          <textarea
            name="description" value={form.description} onChange={handle}
            placeholder="Describe your product or service and what you want to promote…"
            rows={4}
            className={`input-field resize-none ${errors.description ? 'border-red-300 focus:ring-red-400' : ''}`}
          />
          <div className="flex justify-between items-start mt-1">
            <FieldError msg={errors.description} />
            <span className="text-xs text-slate-400 font-body ml-auto">{form.description.length}/1000</span>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <RiGroupLine className="text-brand-500" /> Target Audience *
          </label>
          <select
            name="targetAudience" value={form.targetAudience} onChange={handle}
            className={`input-field ${errors.targetAudience ? 'border-red-300 focus:ring-red-400' : ''}`}>
            <option value="">Select target audience</option>
            {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
          </select>
          <FieldError msg={errors.targetAudience} />
        </div>

        <button onClick={handleNext} className="btn-primary mt-2">Continue →</button>
      </div>
    </div>
  );

  // ── Step 2 ───────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold text-slate-900 mb-1">Budget & Placement</h1>
      <p className="font-body text-slate-500 text-sm mb-8">Set your budget, duration, and placement preferences.</p>

      <div className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Budget */}
          <div>
            <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <RiMoneyDollarCircleLine className="text-brand-500" /> Budget (₹) *
            </label>
            <input
              name="budget" type="number" min="1" value={form.budget} onChange={handle}
              placeholder="e.g. 5000"
              className={`input-field ${errors.budget ? 'border-red-300 focus:ring-red-400' : ''}`}
            />
            <FieldError msg={errors.budget} />
          </div>

          {/* Duration */}
          <div>
            <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <RiCalendarLine className="text-brand-500" /> Duration *
            </label>
            <select
              name="duration" value={form.duration} onChange={handle}
              className={`input-field ${errors.duration ? 'border-red-300 focus:ring-red-400' : ''}`}>
              <option value="">Select duration</option>
              {DURATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <FieldError msg={errors.duration} />
          </div>
        </div>

        {/* Placement */}
        <div>
          <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <RiAdvertisementLine className="text-brand-500" /> Ad Placement *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PLACEMENTS.map((p) => (
              <button key={p} type="button" onClick={() => setPlacement(p)}
                className={`py-2.5 px-3 rounded-xl border text-sm font-body font-medium text-left transition-all
                  ${form.placement === p
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 hover:border-brand-300 text-slate-600'
                  } ${errors.placement ? 'border-red-300' : ''}`}>
                {p}
              </button>
            ))}
          </div>
          <FieldError msg={errors.placement} />
        </div>

        {/* Ad Image Upload */}
        <ImageUploader
          file={form.imageFile}
          existingUrl={form.imageUrl}
onChange={(f) => 
  setForm({ 
    ...form, 
    imageFile: f, 
    imageUrl: f ? '' : ''   // 🔥 always clear when removing
  })
}          error={errors.imageFile}
          onClearError={() => errors.imageFile && setErrors({ ...errors, imageFile: '' })}
        />

        {/* Website */}
        <div>
          <label className="font-body text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <RiGlobalLine className="text-brand-500" /> Landing Page URL
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            name="website" value={form.website} onChange={handle}
            placeholder="https://yourwebsite.com"
            className={`input-field ${errors.website ? 'border-red-300 focus:ring-red-400' : ''}`}
          />
          <FieldError msg={errors.website} />
        </div>

        <div className="flex gap-3">
          <button onClick={handleBack} className="btn-secondary w-auto px-6">← Back</button>
          <button onClick={handleNext} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <>{nextIcon}{nextLabel}</>}
          </button>
        </div>
      </div>
    </div>
  );
}