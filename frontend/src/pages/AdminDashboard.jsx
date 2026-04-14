import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, icon, delay }) => {
  const gradients = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-100",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-100",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-100",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-100"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${gradients[color] || gradients.blue} p-8 rounded-[32px] border shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500`}
    >
      <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">{icon}</div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white shadow-sm`}>{icon}</div>
        <div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
        </div>
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
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!stats) return <div className="p-10 text-center text-slate-500 uppercase font-black text-xs tracking-widest">Failed to initialize engine.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Center</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">System metrics & global oversight</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
              Live Systems
           </div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Active Users" value={stats.totalUsers} color="blue" icon="👥" delay={0.1} />
        <StatCard title="Open Roles" value={stats.totalJobs} color="purple" icon="💼" delay={0.2} />
        <StatCard title="Partner Corps" value={stats.totalCompanies} color="emerald" icon="🏢" delay={0.3} />
        <StatCard title="Applications" value={stats.totalApplications} color="amber" icon="📨" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* RECENT USERS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h2 className="font-black uppercase tracking-[0.2em] text-slate-400 text-[10px]">Onboarding Flow</h2>
            <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Audit All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#fcfdfe] text-slate-400 font-black uppercase tracking-[0.2em] text-[9px]">
                  <tr>
                    <th className="px-10 py-6">Identity</th>
                    <th className="px-10 py-6">Role</th>
                    <th className="px-10 py-6 text-right">Timestamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 whitespace-nowrap text-sm">
                  {stats.recentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">{user.fullName.charAt(0)}</div>
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-black uppercase text-xs tracking-tight">{user.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest">{user.role?.name}</span>
                      </td>
                      <td className="px-10 py-6 text-right text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.createdAt?.slice(0,10)}</td>
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
          className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h2 className="font-black uppercase tracking-[0.2em] text-slate-400 text-[10px]">Market Activity</h2>
            <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Moderation</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#fcfdfe] text-slate-400 font-black uppercase tracking-[0.2em] text-[9px]">
                  <tr>
                    <th className="px-10 py-6">Market Drop</th>
                    <th className="px-10 py-6">Corp</th>
                    <th className="px-10 py-6 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 whitespace-nowrap text-sm">
                  {stats.recentJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-black uppercase text-xs tracking-tight truncate max-w-[200px]">{job.title}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-slate-900 font-black text-xs uppercase tracking-tighter italic">{job.company?.name || 'N/A'}</td>
                      <td className="px-10 py-6 text-right">
                         <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest">Active</span>
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
  );
}
