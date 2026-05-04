import React, { useState } from 'react';

export const Input = ({ label, icon: Icon, error, type = "text", ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4 w-full">
      <div className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${error ? 'border-rose-400 bg-rose-50/50' : isFocused ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-slate-200 hover:border-slate-300'}`}>
        
        {Icon && (
          <div className={`pl-4 ${isFocused ? 'text-blue-500' : 'text-slate-400'} transition-colors`}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        <div className="relative w-full">
          <input
            type={type}
            className="block w-full px-4 pt-6 pb-2 text-slate-900 bg-transparent outline-none peer"
            placeholder=" "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <label className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] peer-focus:text-blue-600 ${Icon ? 'left-4' : 'left-4'} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${error ? 'text-rose-500' : 'text-slate-500'}`}>
            {label}
          </label>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{error}</p>}
    </div>
  );
};
