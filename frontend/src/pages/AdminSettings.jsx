import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/useHooks';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'PrimeJobs',
    supportEmail: 'support@primejobs.com',
    maintenanceMode: false,
    otpEnabled: true,
    maxJobsPerEmployer: 50,
    allowNewRegistrations: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      showToast('System settings updated successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium text-sm">Configure core platform behavior and security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PLATFORM SETTINGS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-500">🌐</span> Platform Branding
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Name</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</label>
              <input 
                type="email" 
                value={settings.supportEmail}
                onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* SECURITY SETTINGS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="text-emerald-500">🛡️</span> Security & Access
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-900">OTP Verification</p>
                <p className="text-[10px] text-slate-400 font-medium">Require OTP for all new signups</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, otpEnabled: !settings.otpEnabled})}
                className={`w-12 h-6 rounded-full transition-all relative ${settings.otpEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.otpEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-900">New Registrations</p>
                <p className="text-[10px] text-slate-400 font-medium">Allow new users to join the platform</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, allowNewRegistrations: !settings.allowNewRegistrations})}
                className={`w-12 h-6 rounded-full transition-all relative ${settings.allowNewRegistrations ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.allowNewRegistrations ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* LIMITS SETTINGS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Usage Limits
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Job Posts (Per Employer)</label>
              <input 
                type="number" 
                value={settings.maxJobsPerEmployer}
                onChange={e => setSettings({...settings, maxJobsPerEmployer: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* SYSTEM STATUS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="text-rose-500">⚠️</span> Critical Actions
          </h3>
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-rose-600">Maintenance Mode</p>
              <p className="text-[10px] text-rose-400 font-medium">Disable platform for everyone except Admins</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
