import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, FolderKanban, Briefcase, GraduationCap, Mail, LogOut, FileText, BarChart3, History, Settings, Award } from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role') || 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, roles: ['admin', 'editor'] },
    { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban, roles: ['admin', 'editor'] },
    { name: 'Experience', path: '/dashboard/experience', icon: Briefcase, roles: ['admin', 'editor'] },
    { name: 'Skills', path: '/dashboard/skills', icon: Award, roles: ['admin', 'editor'] },
    { name: 'Resume', path: '/dashboard/resume', icon: FileText, roles: ['admin', 'editor'] },
    { name: 'Education', path: '/dashboard/education', icon: GraduationCap, roles: ['admin', 'editor'] },
    { name: 'Messages', path: '/dashboard/messages', icon: Mail, roles: ['admin', 'editor'] },
    { name: 'Activity Logs', path: '/dashboard/logs', icon: History, roles: ['admin'] },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-theme bg-card-theme p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-black font-bold">
                  {username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-theme">{username || 'Admin'}</p>
                  <p className="text-xs text-secondary-theme capitalize">{role}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.filter(item => item.roles.includes(role)).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-orange-500 text-black'
                      : 'text-secondary-theme hover:bg-card-theme hover:text-theme'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-6 sm:p-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
