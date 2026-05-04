import React from 'react';

export const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden premium-shadow">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200 backdrop-blur-sm">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                {renderRow(row)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
        <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">10</span> of <span className="font-medium text-slate-900">97</span> results</span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all">Prev</button>
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm transition-all">Next</button>
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ children, status = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    danger: 'bg-rose-50 text-rose-600 border-rose-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    primary: 'bg-blue-50 text-blue-600 border-blue-200',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[status]}`}>
      {children}
    </span>
  );
};
