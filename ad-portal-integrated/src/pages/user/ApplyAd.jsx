import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowLeftLine, RiAdvertisementLine, RiSendPlaneLine } from 'react-icons/ri';
import { adAPI } from '../../api';
import AdCampaignForm, { EMPTY_FORM } from './Adcampaignform';

// Build a FormData from the form state.
// Always called — even when there's no image — so adAPI.create always
// receives FormData and Content-Type is always multipart/form-data.
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
  if (form.imageFile) fd.append('image',   form.imageFile); // field name matches upload.single('image')
  return fd;
}

export default function ApplyAd() {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await adAPI.create(buildFormData(form));
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit ad.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <RiSendPlaneLine className="text-4xl text-green-600" />
        </div>
        <h2 className="font-display text-3xl font-semibold text-slate-900 mb-2">Ad Submitted!</h2>
        <p className="font-body text-slate-500 text-sm mb-8">
          Your ad campaign <strong>"{form.title}"</strong> has been submitted and is pending review.
          You'll be notified once approved.
        </p>
        <Link to="/user/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/user/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-body transition-colors">
            <RiArrowLeftLine /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <RiAdvertisementLine className="text-brand-600 text-xl" />
            <span className="font-display text-lg font-semibold text-slate-900">Apply for Ad</span>
          </div>
          <div className="text-xs font-body text-slate-400">Step {step} of 2</div>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-brand-500 transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 animate-slide-up">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-body">
            {error}
          </div>
        )}
        <AdCampaignForm
          form={form} setForm={setForm}
          step={step}
          errors={errors} setErrors={setErrors}
          onBack={() => setStep(1)}
          onNext={step === 1 ? () => setStep(2) : submit}
          loading={loading}
          nextLabel="Submit Ad Campaign"
          nextIcon={<RiSendPlaneLine />}
        />
      </main>
    </div>
  );
}