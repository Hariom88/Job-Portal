import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Spinner } from '../components/UI';
import { useAsync } from '../hooks/useHooks';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { run } = useAsync();

  const fetchUsers = () => {
    adminService.getAllUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this user?")) return;
    try {
      await run(() => adminService.deleteUser(id));
      fetchUsers();
    } catch (err) {}
  };

  const handleToggleBlock = async (id) => {
    try {
      await run(() => adminService.toggleBlock(id));
      fetchUsers();
    } catch (err) {}
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await run(() => adminService.updateRole(id, newRole));
      fetchUsers();
    } catch (err) {}
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10 space-y-6 lg:space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tighter">User Management</h1>
          <p className="text-sm text-slate-500 font-medium">Manage platform access, roles, and status</p>
        </div>
        <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100">{users.length} Total Users</div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Identification</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Role & Access</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Joined Date</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 whitespace-nowrap">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <select 
                    value={user.role?.name} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-slate-100 border-none rounded-lg px-3 py-1.5 text-xs font-black uppercase text-slate-600 focus:ring-2 focus:ring-blue-200 outline-none"
                   >
                     <option value="ADMIN">ADMIN</option>
                     <option value="COMPANY">COMPANY</option>
                     <option value="CANDIDATE">CANDIDATE</option>
                   </select>
                </td>
                <td className="px-6 py-5">
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                     {user.enabled ? 'Active' : 'Blocked'}
                   </span>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleToggleBlock(user.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all ${user.enabled ? 'text-amber-600 border-amber-100 hover:bg-amber-50' : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}
                    >
                      {user.enabled ? 'Block' : 'Unblock'}
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-rose-600 border border-rose-100 hover:bg-rose-50 transition-all font-outfit"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
