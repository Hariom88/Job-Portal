import React from 'react';

export const JobSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse space-y-4">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-slate-100 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-5 w-40 bg-slate-100 rounded-md"></div>
          <div className="h-4 w-24 bg-slate-50 rounded-md"></div>
        </div>
      </div>
      <div className="w-16 h-6 bg-slate-50 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-slate-50 rounded-md"></div>
      <div className="h-4 w-2/3 bg-slate-50 rounded-md"></div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-8 w-24 bg-slate-50 rounded-lg"></div>
      <div className="h-8 w-24 bg-slate-50 rounded-lg"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
      ))}
    </div>
    <div className="h-96 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
  </div>
);
