import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Spinner } from '../components/UI';
import { useAsync } from '../hooks/useHooks';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { run } = useAsync();

  const fetchData = () => {
    adminService.getAllJobs()
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await run(() => adminService.updateJobStatus(id, status));
      fetchData();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this job listing from the platform?")) return;
    try {
      await run(() => adminService.deleteJob(id));
      fetchData();
    } catch (err) {}
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Job Moderation</h1>
        <p className="text-slate-500 font-medium">Review and approve job listings across the platform</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Details</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Company</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 whitespace-nowrap">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors group font-medium">
                <td className="px-6 py-5">
                   <div>
                     <div className="text-slate-900 font-bold uppercase truncate max-w-[200px]">{job.title}</div>
                     <div className="text-[10px] text-slate-400 tracking-widest uppercase">{job.location} • {job.jobType}</div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="text-slate-900 font-bold flex items-center gap-2">
                     <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px]">🏢</div>
                     {job.company?.name}
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                     job.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                     job.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     {job.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-900">
                   ₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleStatusUpdate(job.id, 'APPROVED')}
                      disabled={job.status === 'APPROVED'}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 disabled:opacity-30"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-rose-600 border border-rose-100 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
