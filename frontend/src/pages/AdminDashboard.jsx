import React, { useState, useEffect } from 'react';
import api, { adminService } from '../services/api';
import { Spinner } from '../components/UI';

const StatCard = ({ title, value, color, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${color}-50 text-${color}-600`}>{icon}</div>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <div className={`text-3xl font-black text-slate-900 mt-1`}>{value}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calling the aggregate aggregate dashboard API
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error("Admin Dashboard Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <div className="p-10 text-center text-slate-500">Failed to load dashboard data.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time platform metrics and activity</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} color="blue" icon="👥" />
        <StatCard title="Total Jobs" value={stats.totalJobs} color="purple" icon="💼" />
        <StatCard title="Companies" value={stats.totalCompanies} color="emerald" icon="🏢" />
        <StatCard title="Applications" value={stats.totalApplications} color="amber" icon="📨" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* RECENT USERS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-black uppercase tracking-widest text-slate-400 text-xs">Recent Registrations</h2>
            <button className="text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Joined</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 whitespace-nowrap font-medium text-slate-600">
                {stats.recentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black">{user.fullName.charAt(0)}</div>
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold">{user.fullName}</span>
                          <span className="text-[10px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-black uppercase">{user.role?.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">{user.createdAt?.slice(0,10)}</td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>

        {/* RECENT JOBS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-black uppercase tracking-widest text-slate-400 text-xs">Recently Posted Jobs</h2>
            <button className="text-blue-600 font-bold hover:underline">Manage All</button>
          </div>
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 whitespace-nowrap font-medium text-slate-600">
                {stats.recentJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold truncate max-w-[150px]">{job.title}</span>
                        <span className="text-[10px] text-slate-400">{job.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-bold italic">{job.company?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">{job.createdAt?.slice(0,10)}</td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
