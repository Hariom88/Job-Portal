import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/api';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, isCandidate } = useAuth();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0F172A] py-32 px-4 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10 text-center"
          >
            <span className="inline-block px-5 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-[0.3em]">
              {isCandidate ? "Premium Career Network" : "Top Talent Discovery"}
            </span>
            
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter">
              {isCandidate ? "BUILD YOUR " : "FIND YOUR "}<br/>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">LEGACY</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Join the elite ecosystem where engineering excellence meets top-tier opportunity. 
              {isCandidate ? " Your next breakthrough starts here." : " Hire the architects of the future."}
            </p>
            
            <div className="flex flex-col md:flex-row max-w-2xl mx-auto gap-3 p-3 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl">
              <div className="flex-1 flex items-center px-4 gap-3 bg-white/5 rounded-2xl">
                 <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 <input 
                    type="text" 
                    placeholder="Search roles, companies..." 
                    className="w-full py-4 outline-none bg-transparent text-white font-bold placeholder:text-slate-600 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 active:scale-95">
                Explore Jobs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-blue-600 font-black text-xs uppercase tracking-[0.4em]">Latest Drops</h2>
            <p className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Open Positions</p>
          </div>
          <div className="px-8 py-4 bg-slate-50 rounded-3xl border border-slate-100">
             <span className="text-slate-900 font-black text-2xl">{filteredJobs.length}</span>
             <span className="text-slate-400 font-black text-[10px] uppercase ml-3 tracking-widest">Global Opportunities</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <motion.div key={job.id} variants={itemVariants}>
                <Link 
                  to={`/job/${job.id}`} 
                  className="group block bg-white border border-slate-100 p-10 rounded-[48px] shadow-sm hover:shadow-3xl hover:shadow-blue-600/10 hover:-translate-y-3 transition-all duration-500 no-underline relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-blue-200">↗</div>
                  </div>

                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform shadow-inner border border-slate-100">🏢</div>
                    <div>
                        <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.15em] mb-1">{job.company?.name || 'Private Corp'}</h4>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{job.location}</p>
                        </div>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 leading-tight mb-10 group-hover:text-blue-600 transition-colors uppercase h-20 overflow-hidden">{job.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-10 font-black">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] rounded-xl uppercase tracking-widest">{job.jobType || 'Full-time'}</span>
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] rounded-xl uppercase tracking-widest">Immediate</span>
                  </div>

                  <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Annual Compensation</span>
                        <span className="text-slate-900 font-black text-2xl tracking-tight">₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No matches found for your search</p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="bg-[#fcfdfe] py-32 border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
           <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Engineers hired from PrimeJobs at</p>
           <div className="flex flex-wrap justify-center items-center gap-16 grayscale opacity-30 select-none">
              <span className="text-3xl font-black tracking-tighter">GOOGLE</span>
              <span className="text-3xl font-black tracking-tighter">META</span>
              <span className="text-3xl font-black tracking-tighter">STRIPE</span>
              <span className="text-3xl font-black tracking-tighter">SOLANA</span>
              <span className="text-3xl font-black tracking-tighter">TESLA</span>
           </div>
        </div>
      </section>
    </div>
  );
}
