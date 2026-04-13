import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import { useAsync }            from '../hooks/useHooks';
import { adminService, jobService } from '../services/api';
import { PrimaryButton, Spinner }   from '../components/UI';

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export function AdminDashboard() {
  const [users,    setUsers]    = useState([]);
  const [jobs,     setJobs]     = useState([]);
  const [tab,      setTab]      = useState('users');
  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getAllUsers(), jobService.getAll()])
      .then(([uRes, jRes]) => { setUsers(uRes.data); setJobs(jRes.data); })
      .finally(() => setPageLoad(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await adminService.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Remove this job?')) return;
    await adminService.deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  if (pageLoad) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500 mt-1">System-wide management & moderation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: users.length, icon: '👥', color: 'blue' },
          { label: 'Active Jobs',  val: jobs.length,  icon: '💼', color: 'purple' },
          { label: 'Companies',    val: users.filter(u => u?.role?.name === 'COMPANY').length, icon: '🏢', color: 'emerald' },
          { label: 'Candidates',   val: users.filter(u => u?.role?.name === 'CANDIDATE').length, icon: '🎯', color: 'rose' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-extrabold text-${s.color}-600`}>{s.val}</div>
            <div className="text-slate-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['users','jobs'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all
              ${tab === t ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
            {t === 'users' ? '👥 Users' : '💼 Jobs'}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {tab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Name','Email','Role','Joined','Action'].map(h => (
                <th key={h} className="px-5 py-4 font-semibold text-slate-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium">{u.fullName}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                      {u?.role?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{u.createdAt?.slice(0,10)}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Jobs Table */}
      {tab === 'jobs' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Title','Company','Location','Status','Action'].map(h => (
                <th key={h} className="px-5 py-4 font-semibold text-slate-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium">{j.title}</td>
                  <td className="px-5 py-3 text-slate-500">{j.company?.name ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{j.location}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold
                      ${j.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDeleteJob(j.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPANY DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
const STATUS_COLORS = {
  PENDING:     'bg-amber-100 text-amber-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  REJECTED:    'bg-red-100 text-red-700',
  HIRED:       'bg-emerald-100 text-emerald-700',
};

export function CompanyDashboard() {
  const { user }              = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs,    setJobs]    = useState([]);
  const [apps,    setApps]    = useState([]);
  const [tab,     setTab]     = useState('listings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Try to find company profile by user ID, then load jobs & applications
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
        .catch(() => {}) // Company profile not set up yet
        .finally(() => setLoading(false));
    });
  }, [user]);

  const handleStatusChange = async (appId, status) => {
    await import('../services/api').then(m => m.applicationService.updateStatus(appId, status));
    setApps(prev => prev.map(a => a.id === appId ? {...a, status} : a));
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {company?.name ?? user?.fullName} — Employer Portal
          </h1>
          <p className="text-slate-500 mt-1">Manage listings and track applications</p>
        </div>
        <Link to="/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all no-underline">
          + Post a Job
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Listings',    val: jobs.length,  icon: '📋' },
          { label: 'Total Applications', val: apps.length,  icon: '📨' },
          { label: 'Shortlisted',        val: apps.filter(a => a.status === 'SHORTLISTED').length, icon: '⭐' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-extrabold text-blue-600">{s.val}</div>
            <div className="text-slate-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['listings','applicants'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all
              ${tab === t ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
            {t === 'listings' ? '📋 Listings' : '👥 Applicants'}
          </button>
        ))}
      </div>

      {/* Job Listings */}
      {tab === 'listings' && (
        <div className="grid gap-4">
          {jobs.length === 0 && <p className="text-slate-400 text-center py-10">No jobs posted yet.</p>}
          {jobs.map(j => (
            <div key={j.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900">{j.title}</h3>
                <p className="text-sm text-slate-500">{j.location} • {j.jobType}</p>
                <p className="text-xs text-slate-400 mt-1">👀 {j.viewsCount} views</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${j.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {j.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicants */}
      {tab === 'applicants' && (
        <div className="grid gap-4">
          {apps.length === 0 && <p className="text-slate-400 text-center py-10">No applications yet.</p>}
          {apps.map(a => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">
                    {a.candidate?.fullName?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <h3 className="font-bold">{a.candidate?.fullName}</h3>
                    <p className="text-sm text-slate-500">{a.candidate?.email}</p>
                    <p className="text-xs text-slate-400">Applied for: <b>{a.job?.title}</b></p>
                  </div>
                </div>
                <select
                  value={a.status}
                  onChange={e => handleStatusChange(a.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer outline-none
                    ${STATUS_COLORS[a.status] ?? 'bg-slate-100'}`}>
                  {['PENDING','SHORTLISTED','REJECTED','HIRED'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {a.coverLetter && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Cover Letter: </span>{a.coverLetter}
                </div>
              )}
              {a.resume?.fileUrl && (
                <a href={a.resume.fileUrl} target="_blank" rel="noreferrer"
                  className="inline-block mt-3 text-blue-600 text-sm font-semibold hover:underline">
                  📄 View Resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CANDIDATE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export function CandidateDashboard() {
  const { user }       = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    import('../services/api').then(({ applicationService }) => {
      applicationService.getByCandidate(user.id)
        .then(res => setApps(res.data))
        .finally(() => setLoading(false));
    });
  }, [user]);

  if (loading) return <Spinner />;

  const statusColor = (s) => ({
    PENDING:     'bg-amber-50 text-amber-700 ring-amber-200',
    SHORTLISTED: 'bg-blue-50 text-blue-700 ring-blue-200',
    HIRED:       'bg-emerald-50 text-emerald-700 ring-emerald-200',
    REJECTED:    'bg-red-50 text-red-700 ring-red-200',
  }[s] ?? 'bg-slate-50 text-slate-600 ring-slate-200');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Career Sync</h1>
        <p className="text-slate-500 mt-1">Track all your applications in one place</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Applied',     val: apps.length, icon: '📨' },
          { label: 'Shortlisted', val: apps.filter(a=>a.status==='SHORTLISTED').length, icon: '⭐' },
          { label: 'Hired',       val: apps.filter(a=>a.status==='HIRED').length,       icon: '🎉' },
          { label: 'Rejected',    val: apps.filter(a=>a.status==='REJECTED').length,    icon: '❌' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-extrabold text-blue-600">{s.val}</div>
            <div className="text-slate-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-lg">Application History</h2>
        </div>
        {apps.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-5xl mb-4">🎯</p>
            <p className="font-medium">No applications yet.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">Browse Jobs →</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {apps.map(a => (
              <div key={a.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">🏢</div>
                  <div>
                    <h3 className="font-bold text-slate-900">{a.job?.title}</h3>
                    <p className="text-sm text-slate-500">{a.job?.company?.name} • {a.job?.location}</p>
                    <p className="text-xs text-slate-400">Applied: {a.appliedAt?.slice(0,10)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${statusColor(a.status)}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-10 text-white text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Ready for your next opportunity?</h2>
        <p className="text-blue-100">Thousands of positions are waiting for someone like you.</p>
        <Link to="/" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform no-underline">
          Browse All Jobs →
        </Link>
      </div>
    </div>
  );
}
