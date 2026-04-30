import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService, searchService } from '../services/api';
import { motion } from 'framer-motion';

const JOB_TYPES = ['All', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP'];

const typeLabel = (t) => ({
  FULL_TIME: 'Full-Time', PART_TIME: 'Part-Time', CONTRACT: 'Contract',
  REMOTE: 'Remote', INTERNSHIP: 'Internship'
}[t] ?? t);

const typeColor = (t) => ({
  FULL_TIME:   'bg-blue-50 text-blue-600 border-blue-100',
  PART_TIME:   'bg-violet-50 text-violet-600 border-violet-100',
  CONTRACT:    'bg-amber-50 text-amber-600 border-amber-100',
  REMOTE:      'bg-emerald-50 text-emerald-600 border-emerald-100',
  INTERNSHIP:  'bg-rose-50 text-rose-600 border-rose-100',
}[t] ?? 'bg-slate-50 text-slate-600 border-slate-100');

const STATS = [
  { value: '10K+', label: 'Active Jobs' },
  { value: '5K+', label: 'Companies' },
  { value: '50K+', label: 'Candidates' },
  { value: '98%', label: 'Success Rate' },
];

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [activeType, setActiveType] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (searchTerm || location || minSalary) {
        // Use Elasticsearch
        const res = await searchService.searchJobs(searchTerm, location, minSalary, null);
        setJobs(res.data);
      } else {
        // Use standard MySQL fetch
        const res = await jobService.getAll();
        setJobs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, location, minSalary]);

  const filteredJobs = jobs.filter(job => {
    const matchType = activeType === 'All' || job.jobType === activeType;
    return matchType;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pt-20 md:pt-24 pb-28 md:pb-32 px-4">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(90deg,#3b82f6 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-600/20 rounded-full blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-violet-600/20 rounded-full blur-[100px] md:blur-[120px]" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6 md:space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] md:text-sm font-semibold uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            {jobs.length > 0 ? `${jobs.length} New Jobs Posted` : 'Hiring is live'}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] md:leading-[1.05]">
            Find Your Dream<br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Career Today.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto font-medium px-4">
            Connect with top companies and land your perfect role — from internships to senior leadership.
          </motion.p>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto pt-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 p-2 md:p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl md:rounded-full px-4 md:px-5 py-1 md:py-2">
                <span className="text-slate-400 text-sm">🔍</span>
                <input
                  type="text" placeholder="Job title, skills..."
                  className="w-full py-2 outline-none text-slate-900 font-semibold placeholder:text-slate-400 bg-transparent text-xs md:text-sm"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl md:rounded-full px-4 md:px-5 py-1 md:py-2">
                <span className="text-slate-400 text-sm">📍</span>
                <input
                  type="text" placeholder="Location..."
                  className="w-full py-2 outline-none text-slate-900 font-semibold placeholder:text-slate-400 bg-transparent text-xs md:text-sm"
                  value={location} onChange={e => setLocation(e.target.value)}
                />
              </div>
              <div className="flex-[0.6] flex items-center gap-3 bg-white rounded-xl md:rounded-full px-4 md:px-5 py-1 md:py-2">
                <span className="text-slate-400 text-sm">💰</span>
                <input
                  type="number" placeholder="Min Salary"
                  className="w-full py-2 outline-none text-slate-900 font-semibold placeholder:text-slate-400 bg-transparent text-xs md:text-sm"
                  value={minSalary} onChange={e => setMinSalary(e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 md:gap-8 pt-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center px-2">
                <div className="text-xl md:text-2xl font-black text-white">{s.value}</div>
                <div className="text-slate-500 text-[10px] md:text-xs font-semibold tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>v>
      </section>

      {/* ── Filter Pills ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex-shrink-0">Filter:</span>
          {JOB_TYPES.map(type => (
            <button key={type} onClick={() => setActiveType(type)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                activeType === type
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}>
              {type === 'All' ? 'All Jobs' : typeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Job Listings ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {searchTerm ? `Results for "${searchTerm}"` : 'Featured Opportunities'}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {user && (
            <Link to="/dashboard" className="text-blue-600 text-sm font-bold hover:underline no-underline">
              My Dashboard →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse space-y-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                  </div>
                </div>
                <div className="h-5 bg-slate-100 rounded-lg" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-bold text-slate-700">No jobs found</h3>
            <p className="text-slate-400">Try a different search term or filter.</p>
            <button onClick={() => { setSearchTerm(''); setActiveType('All'); }}
              className="mt-2 text-blue-600 font-bold hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, idx) => (
              <motion.div key={job.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}>
                <Link to={`/job/${job.id}`}
                  className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100 p-8 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-300 no-underline">
                  
                  {/* Company Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      🏢
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{job.company?.name || 'Private Corp'}</h4>
                      <p className="text-slate-400 text-xs font-semibold truncate">
                        📍 {job.location || 'Location not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                    {job.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-auto pb-6">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${typeColor(job.jobType)}`}>
                      {typeLabel(job.jobType)}
                    </span>
                    {job.experienceRequired > 0 && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                        {job.experienceRequired}+ yrs exp
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-slate-900 font-black text-sm">
                        ₹{(job.salaryMin / 100000).toFixed(1)}L – ₹{(job.salaryMax / 100000).toFixed(1)}L
                      </div>
                      <div className="text-slate-400 text-xs font-medium">Per annum</div>
                    </div>
                    <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Apply <span>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-[40px] p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black tracking-tight">Ready to launch your career?</h2>
              <p className="text-slate-400 font-medium">Join thousands of professionals who found their dream job on PrimeJobs.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/30 no-underline">
                  Get Started — It's Free
                </Link>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10 no-underline">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
