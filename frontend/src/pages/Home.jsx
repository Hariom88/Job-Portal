import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/api';
import { motion } from 'framer-motion';

export default function Home() {
  const { isCandidate } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    jobService.getAll()
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
          >
            Find your dream <span className="text-blue-500">career</span>.
          </motion.h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Over 10,000+ jobs from top companies around the globe are waiting for your talent.
          </p>
          
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 p-4 bg-white rounded-3xl shadow-2xl">
             <input 
                type="text" 
                placeholder="Job title, keywords, or company..." 
                className="flex-1 px-6 py-4 outline-none text-slate-900 font-semibold placeholder:text-slate-400 border-none rounded-2xl bg-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10">
                Search Jobs
              </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-20 space-y-12">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-bold text-slate-900">Featured Opportunities</h2>
           <span className="text-slate-500 font-semibold text-sm">{filteredJobs.length} Positions available</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 uppercase font-bold text-slate-300 tracking-widest animate-pulse">Scanning the market...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <Link 
                key={job.id} 
                to={`/job/${job.id}`} 
                className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-600/5 transition-all no-underline"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 group-hover:scale-110 transition-transform">🏢</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{job.company?.name || 'Private Corp'}</h4>
                    <p className="text-slate-400 text-xs font-semibold">{job.location}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                
                <div className="flex gap-2 mb-8">
                   <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-lg uppercase tracking-wider">{job.jobType}</span>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-slate-900 font-bold">₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L</span>
                   <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">Apply →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
