import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService, applicationService } from '../services/api';
import { Spinner } from '../components/UI';
import { ApplyModal } from './JobForms';

export default function JobDetail() {
  const { id } = useParams();
  const { user, isCandidate } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    // 1. Fetch Job
    jobService.getById(id)
      .then(res => setJob(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));

    // 2. Increment Views
    jobService.incrementViews(id);

    // 3. Check if user already applied
    if (user && isCandidate) {
      applicationService.getByCandidate(user.id).then(res => {
        const hasApplied = res.data.some(app => app.job.id === parseInt(id));
        setApplied(hasApplied);
      });
    }
  }, [id, user, isCandidate, navigate]);

  if (loading || !job) return <Spinner />;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Panel */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-6 items-center">
             <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-4xl">🏢</div>
             <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{job.title}</h1>
                <p className="text-slate-500 font-bold text-lg">{job.company?.name} • {job.location}</p>
             </div>
          </div>
          
          <div className="flex gap-4">
             {isCandidate ? (
               applied ? (
                 <div className="bg-emerald-100 text-emerald-700 px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
                   <span>✓</span> Application Sent
                 </div>
               ) : (
                 <button 
                  onClick={() => setShowApply(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all transform active:scale-95"
                 >
                   Apply Now
                 </button>
               )
             ) : !user ? (
               <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold"
               >
                 Login to Apply
               </button>
             ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400">Job Description</h2>
              <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-line font-medium">
                {job.description}
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400">About {job.company?.name}</h2>
              <p className="text-slate-500 font-medium italic">
                {job.company?.description || "A pioneering tech organization focused on building the future of software and digital transformation."}
              </p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-black uppercase text-slate-400 text-xs tracking-widest">Snapshot</h3>
              <div className="space-y-4">
                 <div className="flex justify-between">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-tighter">Budget</span>
                    <span className="text-slate-900 font-bold">₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-tighter">Experience</span>
                    <span className="text-slate-900 font-bold">{job.experienceRequired}+ Years</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-tighter">Type</span>
                    <span className="text-slate-900 font-bold uppercase">{job.jobType}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-tighter">Views</span>
                    <span className="text-slate-900 font-bold">👀 {job.viewsCount}</span>
                 </div>
              </div>
           </div>

           <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-4">
              <h3 className="text-xl font-black uppercase leading-tight">Fast-track your application</h3>
              <p className="text-blue-100 text-sm font-medium">Verified recruiters usually respond within 48 hours for this role.</p>
           </div>
        </div>
      </div>

      {showApply && (
        <ApplyModal 
          job={job} 
          user={user} 
          onClose={() => setShowApply(false)} 
          onSuccess={() => setApplied(true)} 
        />
      )}
    </div>
  );
}
