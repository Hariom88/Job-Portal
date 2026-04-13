import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Spinner } from '../components/UI';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
);

export default function AdminReports() {
  const [usersByRole, setUsersByRole] = useState({});
  const [jobsByIndustry, setJobsByIndustry] = useState({});
  const [appsSummary, setAppsSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getUsersByRole(),
      adminService.getJobsByIndustry(),
      adminService.getApplicationsSummary()
    ])
      .then(([uRes, jRes, aRes]) => {
        setUsersByRole(uRes.data);
        setJobsByIndustry(jRes.data);
        setAppsSummary(aRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const userGrowthData = {
    labels: Object.keys(usersByRole),
    datasets: [{
      label: 'Count',
      data: Object.values(usersByRole),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      borderRadius: 8,
    }]
  };

  const industryData = {
    labels: Object.keys(jobsByIndustry),
    datasets: [{
      label: 'Jobs by Industry',
      data: Object.values(jobsByIndustry),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(100, 116, 139, 0.8)',
      ],
      borderWidth: 0,
    }]
  };

  const appsByJobData = {
    labels: Object.keys(appsSummary),
    datasets: [{
      label: 'Applications per Job',
      data: Object.values(appsSummary),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">System Analytics</h1>
        <p className="text-slate-500 font-medium">Platform growth and distribution insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* User Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
           <h2 className="font-black uppercase tracking-widest text-slate-400 text-xs">User Role Distribution</h2>
           <div className="h-64">
             <Bar data={userGrowthData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
           </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
           <h2 className="font-black uppercase tracking-widest text-slate-400 text-xs">Jobs by Industry</h2>
           <div className="h-64 flex justify-center">
             <Pie data={industryData} options={{ maintainAspectRatio: false }} />
           </div>
        </div>

        {/* Applications by Job */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
           <h2 className="font-black uppercase tracking-widest text-slate-400 text-xs">Applications by Job Title</h2>
           <div className="h-80">
             <Bar 
              data={appsByJobData} 
              options={{ 
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } }
              }} 
             />
           </div>
        </div>
      </div>
    </div>
  );
}
