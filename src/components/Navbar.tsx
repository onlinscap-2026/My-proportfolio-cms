import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, User, Briefcase, GraduationCap, Mail, FolderKanban, Sun, Moon, ChevronDown, FileText, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const navItems = isDashboard ? [
    { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { name: 'Experience', path: '/dashboard/experience', icon: Briefcase },
    { name: 'Education', path: '/dashboard/education', icon: GraduationCap },
    { name: 'About Me', path: '/dashboard/about', icon: User },
    { name: 'Messages', path: '/dashboard/messages', icon: Mail },
    { name: 'View Site', path: '/', icon: User },
  ] : [
    { name: 'Home', path: '/', icon: User },
    { name: 'About', path: '/about', icon: User },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Experience', path: '/experience', icon: Briefcase },
    { name: 'Education', path: '/education', icon: GraduationCap },
    { name: 'Skills', path: '/skills', icon: Award },
    { name: 'Contact', path: '/contact', icon: Mail },
    { name: 'Admin', path: '/dashboard', icon: LayoutDashboard },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-theme bg-nav-theme backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-theme">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-black font-black">{settings?.siteName?.charAt(0) || 'P'}</span>
            </div>
          )}
          <span>{settings?.siteName || 'PROPORTFOLIO'}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-orange-500 ${
                location.pathname === item.path ? 'text-orange-500' : 'text-secondary-theme'
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
          
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-theme bg-card-theme text-secondary-theme transition-all hover:border-orange-500 hover:text-orange-500"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-theme bg-card-theme text-secondary-theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-theme p-2"
          >
            <div className="space-y-1.5">
              <div className={`h-0.5 w-6 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`h-0.5 w-6 bg-current transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 w-6 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden border-t border-theme bg-nav-theme"
      >
        <div className="space-y-1 px-4 py-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path ? 'bg-orange-500/10 text-orange-500' : 'text-secondary-theme'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
