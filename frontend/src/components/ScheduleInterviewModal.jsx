import React, { useState } from 'react';
import { interviewService } from '../services/api';
import { useToast } from '../hooks/useHooks';

export default function ScheduleInterviewModal({ applicationId, candidateName, onClose }) {
  const [formData, setFormData] = useState({
    applicationId: applicationId,
    scheduledAt: '',
    meetingLink: '',
    notes: ''
  });
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isoDate = new Date(formData.scheduledAt).toISOString();
      await interviewService.schedule({ ...formData, scheduledAt: isoDate });
      
      addToast('Interview scheduled successfully! Email sent to candidate.', 'success');
      onClose();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-xl font-black mb-6 text-slate-900">Schedule Interview</h2>
        <div className="bg-blue-50 text-blue-700 font-bold p-3 rounded-xl mb-6 text-sm text-center">
          Candidate: {candidateName}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date & Time</label>
            <input 
              type="datetime-local" required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none transition-colors"
              value={formData.scheduledAt}
              onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Meeting Link (Zoom/Meet)</label>
            <input 
              type="url" required placeholder="https://meet.google.com/..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-blue-500 outline-none transition-colors"
              value={formData.meetingLink}
              onChange={e => setFormData({...formData, meetingLink: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message / Notes</label>
            <textarea 
              rows="3" placeholder="Any instructions for the candidate..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-blue-500 outline-none resize-none transition-colors"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
