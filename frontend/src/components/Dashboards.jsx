import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// SHARED STAT CARD COMPONENT
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2`}>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
  </div>
);

// ADMIN DASHBOARD
export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Mocking API calls for design
    setUsers([{ id: 1, fullName: 'John Doe', email: 'john@c.com', role: 'COMPANY' }]);
    setJobs([{ id: 101, title: 'React Developer', company: 'Tech Inc', status: 'LIVE' }]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Admin Command Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={users.length} color="text-blue-600" />
        <StatCard title="Active Jobs" value={jobs.length} color="text-purple-600" />
        <StatCard title="System Alerts" value="0" color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Users</h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-slate-600 font-semibold text-sm">Name</th>
              <th className="p-4 text-slate-600 font-semibold text-sm">Role</th>
              <th className="p-4 text-slate-600 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">{u.fullName}</td>
                <td className="p-4 text-sm"><span className="px-2 py-1 rounded-md bg-slate-100">{u.role}</span></td>
                <td className="p-4"><button className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// COMPANY DASHBOARD
export const CompanyDashboard = ({ user }) => {
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    setMyJobs([{ id: 101, title: 'React Developer', location: 'Remote', applicants: 5 }]);
    setApplicants([{ id: 501, name: 'Alice Smith', job: 'React Developer', status: 'PENDING' }]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Employer Portal</h1>
          <p className="text-slate-500 mt-2">Manage your listings and recruit top talent.</p>
        </div>
        <Link to="/post-job" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Post a Job</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h2 className="text-lg font-bold mb-4">Your Active Listings</h2>
           <div className="space-y-4">
             {myJobs.map(j => (
               <div key={j.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                 <div>
                   <h4 className="font-bold">{j.title}</h4>
                   <p className="text-xs text-slate-500">{j.location} • {j.applicants} Applicants</p>
                 </div>
                 <div className="text-blue-600 font-bold">→</div>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h2 className="text-lg font-bold mb-4">Recent Applicants</h2>
           <div className="space-y-4">
             {applicants.map(a => (
               <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{a.name.charAt(0)}</div>
                 <div className="flex-1">
                   <h4 className="text-sm font-bold">{a.name}</h4>
                   <p className="text-xs text-slate-500">Applied for {a.job}</p>
                 </div>
                 <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 font-bold uppercase">{a.status}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// CANDIDATE DASHBOARD
export const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setApplications([{ id: 1, jobTitle: 'Junior Dev', company: 'Google', status: 'SHORTLISTED', date: '2024-03-24' }]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">My Career Sync</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Applications Sent" value={applications.length} color="text-indigo-600" />
        <StatCard title="Shortlists" value="1" color="text-rose-600" />
        <StatCard title="Saved Jobs" value="4" color="text-amber-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold mb-6">Application Tracking</h2>
        <div className="space-y-6">
           {applications.map(app => (
             <div key={app.id} className="flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">🏢</div>
                  <div>
                    <h3 className="font-bold group-hover:text-blue-600 transition-colors uppercase">{app.jobTitle}</h3>
                    <p className="text-sm text-slate-500 font-medium">{app.company} • Applied on {app.date}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold ring-1 ${app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
                  {app.status}
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="mt-8 text-center bg-slate-900 text-white p-12 rounded-3xl space-y-4">
        <h2 className="text-2xl font-bold">Ready for the next big move?</h2>
        <p className="text-slate-400">Advanced search and personalized recommendations are waiting for you.</p>
        <Link to="/" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">Browse New Jobs</Link>
      </div>
    </div>
  );
};
