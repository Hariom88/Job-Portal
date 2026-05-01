import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  // Close on scroll or click outside
  React.useEffect(() => {
    if (!open) return;

    const handleClose = () => setOpen(false);
    
    // Close on any scroll
    window.addEventListener('scroll', handleClose, true);
    
    // Close on click outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-container')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleClose, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative notification-container">
      <button onClick={handleOpen} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            drag="x"
            dragConstraints={{ left: -300, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -100 || velocity.x < -500) {
                setOpen(false);
              }
            }}
            className="absolute right-0 mt-3 w-80 max-h-[32rem] bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 flex flex-col touch-none"
          >
            <div className="p-5 border-b border-slate-50 dark:border-slate-800 font-black text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <span className="text-sm tracking-tight uppercase opacity-50">Notifications</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs">Close</button>
            </div>
            <div className="overflow-y-auto flex-1 scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm font-medium">No new notifications</div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className={`p-5 border-b border-slate-50 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{n.title}</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString()}</div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center">
               <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto opacity-50"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
