import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, icon, delay }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="text-slate-500 text-sm font-semibold tracking-wide">{title}</div>
          <div className="text-4xl font-black text-slate-900">{value}</div>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color] || colors.blue} border shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error("Admin Dashboard Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!stats) return <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest py-32">Failed to load platform data.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-slate-500 font-medium">Real-time oversight of the PrimeJobs ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
              Operational
           </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Candidates" value={stats.totalUsers} color="blue" icon="👥" delay={0.1} />
        <StatCard title="Active Listings" value={stats.totalJobs} color="indigo" icon="💼" delay={0.2} />
        <StatCard title="Registered Companies" value={stats.totalCompanies} color="emerald" icon="🏢" delay={0.3} />
        <StatCard title="Applications" value={stats.totalApplications} color="orange" icon="📝" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT USERS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="font-bold text-slate-900">Recently Joined</h2>
            <button className="text-blue-600 text-xs font-bold hover:underline">View All Users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#fcfdfe] text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4 text-right">Joined</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm">
                  {stats.recentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">{user.fullName.charAt(0)}</div>
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold">{user.fullName}</span>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold uppercase">{user.role?.name}</span>
                      </td>
                      <td className="px-8 py-4 text-right text-xs text-slate-400 font-medium">{user.createdAt?.slice(0,10)}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </motion.div>

        {/* RECENT JOBS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="font-bold text-slate-900">New Job Listings</h2>
            <button className="text-blue-600 text-xs font-bold hover:underline">Moderation</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#fcfdfe] text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">Job Details</th>
                    <th className="px-8 py-4">Company</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm">
                  {stats.recentJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold truncate max-w-[180px]">{job.title}</span>
                          <span className="text-[11px] text-slate-400">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-slate-700 font-bold text-xs">{job.company?.name || 'Private'}</td>
                      <td className="px-8 py-4 text-right">
                         <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase">Open</span>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
