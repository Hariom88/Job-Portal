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
      if (file.size > 1024 * 1024) {
        addToast("Image too large (max 1MB)", "error");
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
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          {/* Header Banner */}
          <div className="h-40 bg-gradient-to-r from-blue-700 to-indigo-800 relative">
             <div className="absolute -bottom-16 left-12 group">
                <div className="relative w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl border border-slate-100 overflow-hidden">
                  {form.profilePicture ? (
                    <img src={form.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300 rounded-2xl uppercase">
                      {user?.fullName.charAt(0)}
                    </div>
                  )}
                  {/* Upload Overlay */}
                  <div 
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                     <span className="text-white text-3xl font-light">+</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
             </div>
          </div>

          <div className="pt-20 pb-12 px-12 space-y-10">
            <div>
               <h1 className="text-3xl font-bold text-slate-900">{user?.fullName}</h1>
               <p className="text-slate-500 font-medium">{user?.role?.name === 'ADMIN' ? 'System Administrator' : user?.role?.name === 'COMPANY' ? 'Hiring Manager' : 'Job Seeker'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
               {/* Section: Basic Information */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest px-1">Basic Info</h3>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 ml-1">Full Name</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 ml-1">Phone Number</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="+91 XXXXX XXXXX"
                            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest px-1">Professional Bio</h3>
                    <textarea 
                      rows="5"
                      placeholder="Tell us about yourself..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                      value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                    />
                  </div>
               </div>

               {/* Section: Skills & Experience */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest px-1">Key Skills</h3>
                    <textarea 
                      rows="4"
                      placeholder="React, Java, Spring Boot, UI Design..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                      value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest px-1">Work Experience</h3>
                    <textarea 
                      rows="4"
                      placeholder="Software Engineer at TechCorp (2022 - Present)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                      value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
                    />
                  </div>
               </div>

               {/* Section: Education */}
               <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest px-1">Education</h3>
                  <textarea 
                    rows="3"
                    placeholder="B.Tech in Computer Science - IIT Bombay..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    value={form.education} onChange={e => setForm({...form, education: e.target.value})}
                  />
               </div>

               <div className="pt-8">
                  <button 
                    disabled={loading}
                    className="group w-full bg-slate-900 text-white py-5 rounded-[20px] font-bold text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-900/10 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>Save My Profile <span className="text-xl group-hover:translate-x-1 transition-transform">→</span></>
                    )}
                  </button>
               </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
