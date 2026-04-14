import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useToast } from '../hooks/useHooks';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ 
    fullName: '', phone: '', bio: '', profilePicture: '', 
    skills: '', experience: '', education: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
        skills: user.skills || '',
        experience: user.experience || '',
        education: user.education || ''
      });
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast("Image too large (max 2MB)", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userService.updateProfile(user.id, form);
      setUser(data);
      localStorage.setItem('jobportal_user', JSON.stringify(data));
      addToast('Profile Updated Successfully', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-12 flex flex-col items-center space-y-8">
             <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <div className="w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white ring-8 ring-blue-50 transition-transform hover:scale-105 duration-500">
                  {form.profilePicture ? (
                    <img src={form.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-6xl font-bold text-slate-300 uppercase">
                      {user?.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Modern Plus Icon Button */}
                <div className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition-all scale-90 group-hover:scale-110">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
             </div>

             <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-slate-900">{user?.fullName}</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{user?.role?.name}</p>
             </div>

             <div className="w-full pt-8 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applications</span>
                   <span className="text-sm font-black text-slate-900">12</span>
                </div>
             </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex-1 p-12 lg:p-16">
            <div className="mb-12">
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit My Profile</h1>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Manage your professional digital record</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                      value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio Description</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                    value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expertise & Skills</label>
                  <textarea 
                    rows="2"
                    placeholder="E.g. React, Java, UI Design..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                    value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Journey</label>
                  <textarea 
                    rows="2"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                    value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education Background</label>
                  <textarea 
                    rows="2"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                    value={form.education} onChange={e => setForm({...form, education: e.target.value})}
                  />
               </div>

               <div className="pt-6">
                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Updating Profile..." : "Update Details"}
                  </button>
               </div>
            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
