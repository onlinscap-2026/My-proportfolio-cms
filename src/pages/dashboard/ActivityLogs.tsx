import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { 
  History, User, Activity, Calendar, 
  PlusCircle, Edit, Trash2, LogIn, Loader2, AlertCircle
} from 'lucide-react';

interface Log {
  _id: string;
  user: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATE': return <PlusCircle className="text-green-500" size={16} />;
    case 'UPDATE': return <Edit className="text-blue-500" size={16} />;
    case 'DELETE': return <Trash2 className="text-red-500" size={16} />;
    case 'LOGIN': return <LogIn className="text-orange-500" size={16} />;
    default: return <Activity className="text-neutral-500" size={16} />;
  }
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/admin/logs', config);
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-theme">Activity Logs</h2>
        <p className="text-sm text-secondary-theme">Audit trail of all administrative actions.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-theme bg-card-theme">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-theme bg-theme">
                <th className="px-6 py-4 font-bold text-secondary-theme">User</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Action</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Target</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Details</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {logs.map((log, i) => (
                <motion.tr
                  key={log._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="group hover:bg-neutral-900/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-neutral-400">
                        <User size={14} />
                      </div>
                      <span className="font-medium text-white">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="font-medium text-neutral-300">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      {log.targetType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Calendar size={14} />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
