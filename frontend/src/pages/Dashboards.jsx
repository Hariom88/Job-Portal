import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useHooks';
import { adminService, jobService } from '../services/api';
import { PrimaryButton, Spinner } from '../components/UI';
import { motion } from 'framer-motion';
import ChatBox from '../components/ChatBox';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';

// ═══════════════════════════════════════════════════════════════════════════
// COMPANY DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
const STATUS_COLORS = {
  PENDING:     'bg-amber-50 text-amber-600 border-amber-200',
  SHORTLISTED: 'bg-blue-50 text-blue-600 border-blue-200',
  REJECTED:    'bg-rose-50 text-rose-600 border-rose-200',
  HIRED:       'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export function CompanyDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [tab, setTab] = useState('listings');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [scheduleApp, setScheduleApp] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    if (!user) return;
    import('../services/api').then(({ companyService, applicationService }) => {
      companyService.getByOwnerId(user.id)
        .then(res => {
          const co = res.data;
          setCompany(co);
          return Promise.all([
            import('../services/api').then(m => m.jobService.getByCompany(co.id)),
            applicationService.getByCompany(co.id),
          ]);
        })
        .then(([jRes, aRes]) => { setJobs(jRes.data); setApps(aRes.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [user]);

  const handleStatusChange = async (appId, status) => {
    await import('../services/api').then(m => m.applicationService.updateStatus(appId, status));
    setApps(prev => prev.map(a => a.id === appId ? {...a, status} : a));
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-200/50">🏢</div>
             <div>
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                 {company?.name ?? user?.fullName}
               </h1>
               <p className="text-slate-500 font-medium mt-1">Employer Control Center</p>
             </div>
          </div>
          
          <Link to="/post-job"
            className="relative z-10 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all transform hover:-translate-y-1 no-underline whitespace-nowrap">
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Listings', val: jobs.length, icon: '💼', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Applications', val: apps.length, icon: '📨', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Shortlisted', val: apps.filter(a => a.status === 'SHORTLISTED').length, icon: '⭐', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</div>
                <div className="text-4xl font-black text-slate-900">{s.val}</div>
              </div>
              <div className={`w-16 h-16 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-2 bg-white rounded-2xl w-fit shadow-sm border border-slate-100">
          {['listings', 'applicants'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all
                ${tab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              {t === 'listings' ? '📋 Job Listings' : '👥 Applicants'}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {tab === 'listings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.length === 0 ? (
                <div className="col-span-full bg-white rounded-[32px] border border-slate-100 p-16 text-center space-y-4">
                  <div className="text-6xl">📝</div>
                  <h3 className="text-xl font-bold text-slate-700">No jobs posted yet</h3>
                  <p className="text-slate-400 font-medium">Create your first listing to start receiving applications.</p>
                </div>
              ) : jobs.map(j => (
                <div key={j.id} className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">{j.title}</h3>
                      <div className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                        <span>📍 {j.location}</span>
                        <span>•</span>
                        <span>💼 {j.jobType}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${j.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {j.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="text-sm font-bold text-slate-400 flex items-center gap-2">
                      <span className="bg-slate-50 px-3 py-1 rounded-lg">👀 {j.viewsCount} Views</span>
                      <span className="bg-slate-50 px-3 py-1 rounded-lg">📨 {apps.filter(a => a.job?.id === j.id).length} Apps</span>
                    </div>
                    <Link to={`/job/${j.id}`} className="text-blue-600 font-bold text-sm hover:underline">View Live →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'applicants' && (
            <div className="space-y-4">
              {apps.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-slate-100 p-16 text-center space-y-4">
                  <div className="text-6xl">📭</div>
                  <h3 className="text-xl font-bold text-slate-700">Inbox empty</h3>
                  <p className="text-slate-400 font-medium">No applications have been submitted yet.</p>
                </div>
              ) : apps.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between hover:border-blue-100 transition-colors">
                  
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100 flex-shrink-0">
                      {a.candidate?.fullName?.charAt(0) ?? '?'}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-lg">{a.candidate?.fullName}</h3>
                      <div className="text-sm font-medium text-slate-500">{a.candidate?.email}</div>
                      <div className="text-xs font-bold text-slate-400 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                        Applied for: <span className="text-slate-700">{a.job?.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-4">
                    <div className="relative">
                      <select
                        value={a.status}
                        onChange={e => handleStatusChange(a.id, e.target.value)}
                        className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-sm font-bold cursor-pointer outline-none transition-colors shadow-sm
                          ${STATUS_COLORS[a.status] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {['PENDING','SHORTLISTED','REJECTED','HIRED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs">▼</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => setChatUser({ id: a.candidate.id, name: a.candidate.fullName })}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md">
                        💬 Chat
                      </button>
                      <button onClick={() => setScheduleApp({ id: a.id, name: a.candidate.fullName })}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                        📅 Schedule
                      </button>
                      {a.resume?.fileUrl && (
                        <a href={a.resume.fileUrl} target="_blank" rel="noreferrer"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                          📄 Resume
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>
      </div>

      {/* Modals */}
      {chatUser && (
        <ChatBox targetUserId={chatUser.id} targetName={chatUser.name} onClose={() => setChatUser(null)} />
      )}
      {scheduleApp && (
        <ScheduleInterviewModal applicationId={scheduleApp.id} candidateName={scheduleApp.name} onClose={() => setScheduleApp(null)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CANDIDATE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export function CandidateDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    if (!user) return;
    import('../services/api').then(({ applicationService }) => {
      applicationService.getByCandidate(user.id)
        .then(res => setApps(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [user]);

  if (loading) return <Spinner />;

  const statusColor = (s) => ({
    PENDING:     'bg-amber-50 text-amber-600 border-amber-200',
    SHORTLISTED: 'bg-blue-50 text-blue-600 border-blue-200',
    HIRED:       'bg-emerald-50 text-emerald-600 border-emerald-200',
    REJECTED:    'bg-rose-50 text-rose-600 border-rose-200',
  }[s] ?? 'bg-slate-50 text-slate-600 border-slate-200');

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl">
               {user?.fullName?.charAt(0) ?? 'U'}
             </div>
             <div>
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                 Hello, {user?.fullName?.split(' ')[0] ?? 'Candidate'}!
               </h1>
               <p className="text-slate-500 font-medium mt-1">Here's your career progress.</p>
             </div>
          </div>
          
          <Link to="/"
            className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 no-underline whitespace-nowrap">
            Explore Jobs →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Applied', val: apps.length, icon: '📨', color: 'text-slate-600', bg: 'bg-slate-50' },
            { label: 'Shortlisted', val: apps.filter(a=>a.status==='SHORTLISTED').length, icon: '⭐', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Hired', val: apps.filter(a=>a.status==='HIRED').length, icon: '🎉', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Rejected', val: apps.filter(a=>a.status==='REJECTED').length, icon: '❌', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm text-center group hover:shadow-md transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 mx-auto rounded-2xl ${s.bg} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{s.val}</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-blue-500">❖</span> Application History
            </h2>
          </div>
          
          {apps.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="text-6xl mb-4 opacity-50">🧭</div>
              <h3 className="text-xl font-bold text-slate-700">Your journey starts here.</h3>
              <p className="text-slate-400 font-medium">You haven't applied to any positions yet.</p>
              <Link to="/" className="mt-4 inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors no-underline">Find your dream job</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {apps.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl border border-slate-200 shadow-sm">
                      🏢
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg mb-1">{a.job?.title}</h3>
                      <div className="text-sm font-semibold text-slate-500">
                        {a.job?.company?.name} <span className="mx-1">•</span> {a.job?.location}
                      </div>
                      <div className="text-xs font-bold text-slate-400 mt-2">
                        Applied: {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                    <button onClick={() => setChatUser({ id: a.job.company.owner.id, name: a.job.company.name })}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md w-full md:w-auto text-center">
                      💬 Chat
                    </button>
                    <span className={`w-full md:w-32 text-center px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border ${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                    <Link to={`/job/${a.job?.id}`} className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex-shrink-0">
                      ↗
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
      
      {/* Modals */}
      {chatUser && (
        <ChatBox targetUserId={chatUser.id} targetName={chatUser.name} onClose={() => setChatUser(null)} />
      )}
    </div>
  );
}
