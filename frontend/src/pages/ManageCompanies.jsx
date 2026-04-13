import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Spinner } from '../components/UI';
import { useAsync } from '../hooks/useHooks';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { run } = useAsync();

  const fetchData = () => {
    adminService.getAllCompanies()
      .then(res => setCompanies(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await run(() => adminService.updateCompanyStatus(id, status));
      fetchData();
    } catch (err) {}
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Company Moderation</h1>
        <p className="text-slate-500 font-medium">Verify and manage employer accounts</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Company Identity</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Industry & Location</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Registered</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 whitespace-nowrap">
            {companies.map(company => (
              <tr key={company.id} className="hover:bg-slate-50 transition-colors group font-medium">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl">🏢</div>
                     <div>
                       <div className="text-slate-900 font-bold uppercase">{company.name}</div>
                       <div className="text-xs text-slate-400 tracking-tight">{company.owner?.email}</div>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="text-slate-600 text-sm font-bold">{company.industry}</div>
                   <div className="text-xs text-slate-400 tracking-tight">{company.location}</div>
                </td>
                <td className="px-6 py-5">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                     company.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                     company.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     {company.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-400">
                   {new Date(company.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleStatusUpdate(company.id, 'APPROVED')}
                      disabled={company.status === 'APPROVED'}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 disabled:opacity-30"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(company.id, 'REJECTED')}
                      disabled={company.status === 'REJECTED'}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 disabled:opacity-30"
                    >
                      Reject
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
