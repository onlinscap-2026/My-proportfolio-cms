import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="border-t border-theme bg-card-theme py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
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
            <p className="text-sm text-secondary-theme leading-relaxed">
              {settings?.description || 'A professional portfolio system built with modern technologies.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-theme">Navigation</h4>
            <ul className="space-y-2 text-sm text-secondary-theme">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/projects" className="hover:text-orange-500 transition-colors">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-orange-500 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-theme">Social</h4>
            <div className="flex gap-4">
              {settings?.socialLinks.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-secondary-theme hover:text-theme transition-colors"><Github size={20} /></a>
              )}
              {settings?.socialLinks.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary-theme hover:text-theme transition-colors"><Linkedin size={20} /></a>
              )}
              {settings?.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-secondary-theme hover:text-theme transition-colors"><Twitter size={20} /></a>
              )}
              <a href={`mailto:${settings?.email}`} className="text-secondary-theme hover:text-theme transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-theme">Newsletter</h4>
            <p className="mb-4 text-xs text-secondary-theme">Get notified about my latest projects and articles.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-lg border border-theme bg-theme px-3 py-2 text-xs text-theme outline-none focus:border-orange-500"
              />
              <button className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-orange-500 hover:text-white transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-900 pt-8 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {settings?.siteName || 'ProPortfolio CMS'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
