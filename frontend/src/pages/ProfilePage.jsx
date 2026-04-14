import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useToast } from '../hooks/useHooks';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ fullName: '', phone: '', bio: '', profilePicture: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userService.updateProfile(user.id, form);
      setUser(data);
      localStorage.setItem('jobportal_user', JSON.stringify(data));
      addToast('Profile Synchronized', 'success');
    } catch (err) {
      addToast('Sync Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
             <div className="absolute -bottom-16 left-10 p-2 bg-white rounded-[32px] shadow-xl">
                <div className="w-32 h-32 rounded-[24px] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white">
                  {form.profilePicture ? (
                    <img src={form.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-slate-300">{user?.fullName.charAt(0)}</span>
                  )}
                </div>
             </div>
          </div>

          <div className="pt-24 pb-12 px-10 space-y-12">
            <div>
               <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{user?.fullName}</h1>
               <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{user?.role?.name} • Active Node</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-600 transition-all"
                      value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comms Phone</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-600 transition-all"
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Image URL</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-600 transition-all"
                      placeholder="https://images.unsplash.com/..."
                      value={form.profilePicture} onChange={e => setForm({...form, profilePicture: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biography</label>
                    <textarea 
                      rows="1"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-600 transition-all"
                      value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                    />
                  </div>
               </div>

               <div className="col-span-full pt-4">
                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Synchronizing..." : "Update Profile Node"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
