import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col">
          <div className="p-4 border-b border-slate-50 font-bold text-slate-900 bg-slate-50/50 flex justify-between items-center">
            <span>Notifications</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm font-medium">No new notifications</div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className={`p-4 border-b border-slate-50 text-sm ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                  <div className="font-bold text-slate-900">{n.title}</div>
                  <div className="text-slate-600 mt-1">{n.message}</div>
                  <div className="text-xs text-slate-400 mt-2 font-medium">{new Date(n.createdAt).toLocaleTimeString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
