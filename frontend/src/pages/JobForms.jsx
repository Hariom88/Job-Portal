import { useState, useEffect } from 'react';
import { Link, useNavigate }    from 'react-router-dom';
import { useAuth }              from '../context/AuthContext';
import { useAsync }             from '../hooks/useHooks';
import { jobService, companyService } from '../services/api';
import { FormField, SelectField, PrimaryButton } from '../components/UI';

// ═══════════════════════════════════════════════════════════════════════════
// POST JOB FORM  (Company only)
// ═══════════════════════════════════════════════════════════════════════════
export function PostJobPage() {
  const { user }          = useAuth();
  const { loading, run }  = useAsync();
  const navigate          = useNavigate();

  const [companyId, setCompanyId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', location: '', jobType: 'FULL_TIME',
    salaryMin: '', salaryMax: '', experienceRequired: '', status: 'OPEN',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    companyService.getByOwnerId(user.id)
      .then(res => setCompanyId(res.data.id))
      .catch(() => {});
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!companyId) { setErrors({ title: 'No company profile found. Set up your company first.' }); return; }
    try {
      await run(() => jobService.post(form, companyId));
      setSuccess('Job posted successfully! 🎉');
      setTimeout(() => navigate('/company'), 1500);
    } catch {
      setErrors({ title: 'Failed to post job. Please try again.' });
    }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link to="/company" className="text-blue-600 text-sm hover:underline">← Back to Dashboard</Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Post a New Job</h1>
        <p className="text-slate-500">Fill in the details below to attract top candidates</p>
      </div>

      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl mb-6 font-medium">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5">
        <FormField label="Job Title *" name="title" placeholder="e.g. Senior React Developer"
          value={form.title} onChange={f('title')} error={errors.title} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">Job Description *</label>
          <textarea rows={5} placeholder="Describe the role, responsibilities, and requirements..."
            value={form.description} onChange={f('description')}
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all
              ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200'}
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100`} />
          {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Location *" placeholder="e.g. Bangalore, India or Remote"
            value={form.location} onChange={f('location')} error={errors.location} />
          <SelectField label="Job Type" value={form.jobType} onChange={f('jobType')}>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Min Salary (₹)" type="number" placeholder="500000"
            value={form.salaryMin} onChange={f('salaryMin')} />
          <FormField label="Max Salary (₹)" type="number" placeholder="1500000"
            value={form.salaryMax} onChange={f('salaryMax')} />
          <FormField label="Experience (yrs)" type="number" placeholder="3"
            value={form.experienceRequired} onChange={f('experienceRequired')} />
        </div>

        <SelectField label="Status" value={form.status} onChange={f('status')}>
          <option value="OPEN">Open</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </SelectField>

        <PrimaryButton type="submit" loading={loading} className="w-full mt-2">
          {loading ? 'Publishing...' : 'Publish Job 🚀'}
        </PrimaryButton>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APPLY JOB MODAL  (Candidate)
// ═══════════════════════════════════════════════════════════════════════════
export function ApplyModal({ job, user, onClose, onSuccess }) {
  const { run, loading } = useAsync();
  const [form, setForm]  = useState({ coverLetter: '', experienceYears: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Build application payload — no file upload endpoint yet, just send URL placeholder
    const payload = {
      job:       { id: job.id },
      candidate: { id: user.id },
      coverLetter: form.coverLetter,
      // resume will be attached separately if resume upload endpoint exists
    };

    try {
      await run(() => import('../services/api').then(m => m.applicationService.apply(payload)));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data || 'Failed to submit application');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xl">✕</button>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Apply for this Role</h2>
          <p className="text-slate-500 text-sm mt-1">{job.title}</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Cover Letter</label>
            <textarea rows={4} placeholder="Tell us why you're the perfect fit..."
              value={form.coverLetter}
              onChange={e => setForm(f => ({...f, coverLetter: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <FormField label="Years of Experience" type="number" placeholder="e.g. 3"
            value={form.experienceYears}
            onChange={e => setForm(f => ({...f, experienceYears: e.target.value}))} />

          {/* Resume Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Resume (PDF/DOC)</label>
            <div className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
              ${resumeFile ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="resume-upload"
                onChange={e => setResumeFile(e.target.files[0])} />
              <label htmlFor="resume-upload" className="cursor-pointer">
                {resumeFile
                  ? <span className="text-blue-600 font-medium text-sm">✅ {resumeFile.name}</span>
                  : <span className="text-slate-500 text-sm">📎 Click to upload your resume</span>}
              </label>
            </div>
          </div>

          <PrimaryButton type="submit" loading={loading} className="w-full">
            Submit Application 🚀
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
