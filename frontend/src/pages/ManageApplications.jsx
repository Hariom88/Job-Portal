import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Spinner } from '../components/UI';

export default function ManageApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    adminService.getAllApplications()
      .then(res => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredApps = apps.filter(app => 
    app.job?.title.toLowerCase().includes(filter.toLowerCase()) ||
    app.candidate?.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Application Tracking</h1>
          <p className="text-slate-500 font-medium">Monitor all job applications across the platform</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 w-full md:w-80">
          <input 
            type="text" 
            placeholder="Filter by job or candidate..." 
            className="flex-1 px-4 py-2 outline-none text-sm font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="px-3 text-slate-300">🔍</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-5">Candidate</th>
              <th className="px-6 py-5">Applied For</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-right">Applied Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 whitespace-nowrap">
            {filteredApps.map(app => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors group font-medium text-sm">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">{app.candidate?.fullName.charAt(0)}</div>
                     <div>
                       <div className="text-slate-900 font-bold">{app.candidate?.fullName}</div>
                       <div className="text-[10px] text-slate-400 font-bold tracking-tight">{app.candidate?.email}</div>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="text-slate-900 font-bold uppercase truncate max-w-[200px]">{app.job?.title}</div>
                   <div className="text-[10px] text-slate-400 font-bold italic">{app.job?.company?.name}</div>
                </td>
                <td className="px-6 py-5 text-center">
                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                     app.status === 'HIRED' ? 'bg-emerald-100 text-emerald-700' :
                     app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 
                     app.status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                   }`}>
                     {app.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right text-slate-400 font-bold">
                   {new Date(app.appliedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
