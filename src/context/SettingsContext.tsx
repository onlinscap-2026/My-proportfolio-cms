import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
}

interface ThemeSettings {
  defaultMode: 'dark' | 'light';
  primaryColor: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

interface Settings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  description: string;
  fullName: string;
  jobTitle: string;
  bio: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLinks;
  theme: ThemeSettings;
  seo: SEOSettings;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      setSettings(res.data);
      
      // Update document title and favicon if settings exist
      if (res.data) {
        document.title = res.data.seo.metaTitle || res.data.siteName;
        
        // Update Meta Tags
        const updateMeta = (name: string, content: string) => {
          let el = document.querySelector(`meta[name='${name}']`);
          if (!el) {
            el = document.createElement('meta');
            el.setAttribute('name', name);
            document.head.appendChild(el);
          }
          el.setAttribute('content', content);
        };

        updateMeta('description', res.data.seo.metaDescription || res.data.description);
        updateMeta('keywords', res.data.seo.keywords);
        
        if (res.data.faviconUrl) {
          const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = res.data.faviconUrl;
          } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = res.data.faviconUrl;
            document.head.appendChild(newLink);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
