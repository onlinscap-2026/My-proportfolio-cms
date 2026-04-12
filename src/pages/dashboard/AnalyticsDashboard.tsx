import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, FolderKanban, Briefcase, Mail, TrendingUp, 
  Eye, MousePointer2, Loader2, AlertCircle 
} from 'lucide-react';

interface AnalyticsData {
  projects: number;
  experience: number;
  messages: number;
  views: Array<{ identifier: string; count: number }>;
  clicks: Array<{ identifier: string; count: number }>;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/admin/analytics', config);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data.');
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

  if (error || !data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-400">{error || 'No data available'}</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: data.projects, icon: FolderKanban, color: 'text-blue-500' },
    { label: 'Work Experience', value: data.experience, icon: Briefcase, color: 'text-orange-500' },
    { label: 'Messages Received', value: data.messages, icon: Mail, color: 'text-green-500' },
    { label: 'Total Page Views', value: data.views.reduce((acc, v) => acc + v.count, 0), icon: Eye, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-theme">Analytics Overview</h2>
        <p className="text-sm text-secondary-theme">Track your portfolio's performance and activity.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-theme bg-card-theme p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl bg-theme p-3 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp className="text-secondary-theme opacity-20" size={20} />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-theme">{stat.value}</p>
              <p className="text-sm text-secondary-theme">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Page Views Chart */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
          <h3 className="mb-6 text-lg font-bold text-white">Page Views by Section</h3>
          <div className="relative h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.views}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="identifier" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Project Clicks Chart */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
          <h3 className="mb-6 text-lg font-bold text-white">Project Interaction</h3>
          <div className="relative h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.clicks}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="identifier"
                >
                  {data.clicks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {data.clicks.map((click, i) => (
              <div key={click.identifier} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs text-neutral-400">{click.identifier}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
