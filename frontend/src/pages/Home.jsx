import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/api';
import { Spinner } from '../components/UI';

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {isCandidate ? "Welcome back for your next move! 🚀" : "Find the world's best talent 🌍"}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
            {isCandidate ? "Discover Your Dream " : "Hire the World's Best "}
            <span className="text-blue-600">Career</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            {isCandidate 
              ? "Explore 10,000+ open positions from top-tier tech companies. Join the future of work today."
              : "Post your opportunities to a global pool of active professionals and stealth-mode experts."}
          </p>
          
          <div className="flex max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-blue-100 border border-slate-100">
            <input 
              type="text" 
              placeholder="Job title, company, or keywords..." 
              className="flex-1 px-4 py-3 outline-none text-slate-700 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs-section" className="max-w-7xl mx-auto px-4 py-20 space-y-12">
        <div className="flex items-end justify-between border-b border-slate-100 pb-8 uppercase">
          <div>
            <h2 className="text-sm font-bold text-blue-600 tracking-widest">Available Positions</h2>
            <p className="text-2xl font-black text-slate-900 mt-1">Latest Openings</p>
          </div>
          <p className="text-slate-400 font-bold text-sm tracking-tighter">{filteredJobs.length} Positions Found</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <Link 
                to={`/job/${job.id}`} 
                key={job.id} 
                className="group bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-50 hover:border-blue-200 transition-all no-underline"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏢</div>
                  <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg uppercase tracking-wider">{job.jobType || 'Full-time'}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase truncate">{job.title}</h3>
                <p className="text-slate-500 font-medium mt-1 mb-6 flex items-center gap-1.5 truncate">
                   {job.company?.name || 'Private Corp'} • {job.location}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <span className="text-slate-900 font-bold tracking-tight">₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L <span className="text-slate-400 font-medium text-xs">/yr</span></span>
                   <span className="text-blue-600 font-bold text-sm">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="bg-slate-50 py-20 border-y border-slate-100 italic">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
           <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Trusted by builders at</p>
           <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
              <span className="text-2xl font-black">GOOGLE</span>
              <span className="text-2xl font-black">AWS</span>
              <span className="text-2xl font-black">CRED</span>
              <span className="text-2xl font-black">ZEPTO</span>
              <span className="text-2xl font-black">RAZORPAY</span>
           </div>
        </div>
      </section>
    </div>
  );
}
