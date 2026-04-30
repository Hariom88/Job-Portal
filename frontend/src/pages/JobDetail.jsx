import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService, applicationService, aiService } from '../services/api';
import { Spinner } from '../components/UI';
import { ApplyModal } from './JobForms';
import { motion } from 'framer-motion';

const typeColor = (t) => ({
  FULL_TIME:   'bg-blue-50 text-blue-600 border-blue-100',
  PART_TIME:   'bg-violet-50 text-violet-600 border-violet-100',
  CONTRACT:    'bg-amber-50 text-amber-600 border-amber-100',
  REMOTE:      'bg-emerald-50 text-emerald-600 border-emerald-100',
  INTERNSHIP:  'bg-rose-50 text-rose-600 border-rose-100',
}[t] ?? 'bg-slate-50 text-slate-600 border-slate-100');

const typeLabel = (t) => ({
  FULL_TIME: 'Full-Time', PART_TIME: 'Part-Time', CONTRACT: 'Contract',
  REMOTE: 'Remote', INTERNSHIP: 'Internship'
}[t] ?? t);


export default function JobDetail() {
  const { id } = useParams();
  const { user, isCandidate } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    // 1. Fetch Job
    jobService.getById(id)
      .then(res => setJob(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));

    // 2. Increment Views
    jobService.incrementViews(id).catch(()=>{});

    // 3. Check if user already applied
    if (user && isCandidate) {
      applicationService.getByCandidate(user.id).then(res => {
        const hasApplied = res.data.some(app => app.job?.id === parseInt(id));
        setApplied(hasApplied);
      }).catch(()=>{});

      // 4. Get AI Match Score
      aiService.getJobMatchScore(id).then(res => {
        setMatchScore(res.data);
      }).catch(err => console.log('Match score not available', err));
    }
  }, [id, user, isCandidate, navigate]);

  if (loading || !job) return <Spinner />;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 pt-12 md:pt-16 pb-10 md:pb-12 px-4 shadow-sm relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-72 md:w-[600px] h-72 md:h-[600px] bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-6 md:mb-8 transition-colors no-underline">
            <span>←</span> Back
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row gap-5 md:gap-6 md:items-center w-full">
               <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[24px] md:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">🏢</div>
               <div className="space-y-2 md:space-y-3 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight truncate">{job.title}</h1>
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold border ${job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 font-semibold text-xs md:text-sm">
                    <span className="flex items-center gap-1">🏢 <span className="text-slate-700 truncate">{job.company?.name || 'Private Company'}</span></span>
                    <span className="hidden md:inline text-slate-300">•</span>
                    <span className="flex items-center gap-1">📍 <span>{job.location}</span></span>
                    <span className="hidden md:inline text-slate-300">•</span>
                    <span className="flex items-center gap-1">👀 <span>{job.viewsCount} Views</span></span>
                  </div>
               </div>
            </div>
            
            <div className="flex w-full lg:w-auto gap-4">
               {isCandidate ? (
                 applied ? (
                   <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-sm text-sm md:text-base">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     Applied
                   </div>
                 ) : (
                   <button 
                    onClick={() => setShowApply(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95 text-sm md:text-base"
                   >
                     Apply Now
                   </button>
                 )
               ) : !user ? (
                 <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 md:px-10 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm md:text-base"
                 >
                   Log in to Apply
                 </button>
               ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
           
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
             className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">📄</span>
                Job Description
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium whitespace-pre-wrap">
                {job.description}
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
             className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">🏢</span>
                About the Company
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium whitespace-pre-wrap">
                {job.company?.description || "A pioneering organization focused on building the future and driving innovation in its industry. We value talent and foster a culture of growth."}
              </div>
           </motion.div>

        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-8 lg:sticky lg:top-8">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
             className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="font-black text-slate-900 text-lg">Role Overview</h3>
              
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">💰</div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Compensation</div>
                      <div className="text-slate-900 font-black text-lg">₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L <span className="text-sm text-slate-400 font-semibold">/ yr</span></div>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">⏳</div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Experience Needed</div>
                      <div className="text-slate-900 font-black text-base">{job.experienceRequired}+ Years</div>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">🏷️</div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Job Type</div>
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border mt-1 ${typeColor(job.jobType)}`}>
                        {typeLabel(job.jobType)}
                      </span>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center flex-shrink-0">📅</div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Posted On</div>
                      <div className="text-slate-900 font-bold text-base">{job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</div>
                    </div>
                 </div>
               </div>
           </motion.div>

           {matchScore && matchScore.match_percentage > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-[32px] border border-emerald-100 shadow-sm space-y-4">
                 <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                   <span className="text-xl">🤖</span> AI Match Score
                 </h3>
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-700 text-xl bg-white shadow-inner flex-shrink-0">
                     {matchScore.match_percentage}%
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-700">Strong Candidate</p>
                     <p className="text-xs text-slate-500 font-medium mt-1">Based on {matchScore.matched_skills.join(', ')}</p>
                   </div>
                 </div>
                 {matchScore.missing_skills?.length > 0 && (
                   <div className="text-xs font-semibold text-rose-500 bg-white p-3 rounded-xl shadow-sm border border-rose-100">
                     Missing: {matchScore.missing_skills.slice(0,3).join(', ')}
                   </div>
                 )}
              </motion.div>
           )}

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
             className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white space-y-6 relative overflow-hidden shadow-xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <h3 className="text-2xl font-black leading-tight">Stand out from the crowd.</h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed">
                Ensure your profile is complete and up-to-date. Candidates with full profiles are 3x more likely to be shortlisted.
              </p>
              
              {user && isCandidate && !applied && (
                 <button onClick={() => setShowApply(true)} className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors">
                   Submit Application →
                 </button>
              )}
           </motion.div>
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
