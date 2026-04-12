import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Save, Globe, User, Phone, Mail, MapPin, Share2, Palette, Search, Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import FileUpload from '../../components/FileUpload';

export default function SettingsPage() {
  const { settings: globalSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (globalSettings) {
      setFormData(globalSettings);
      setLoading(false);
    }
  }, [globalSettings]);

  const handleChange = (section: string, field: string, value: any) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.post('/api/settings', formData, config);
      await refreshSettings();
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-theme">Website Settings</h2>
          <p className="text-sm text-secondary-theme">Manage your global website information and content.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
            message.type === 'success' 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-theme pb-4">
            <Globe className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-theme">General Information</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Website Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange('', 'siteName', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <FileUpload 
              label="Website Logo" 
              currentUrl={formData.logoUrl} 
              onUploadSuccess={(url) => handleChange('', 'logoUrl', url)} 
            />
            <FileUpload 
              label="Favicon" 
              currentUrl={formData.faviconUrl} 
              onUploadSuccess={(url) => handleChange('', 'faviconUrl', url)} 
            />
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Site Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('', 'description', e.target.value)}
                className="w-full min-h-[100px] rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Personal Info */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-theme pb-4">
            <User className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-theme">Personal Information</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('', 'fullName', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange('', 'jobTitle', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <FileUpload 
              label="Profile Image" 
              currentUrl={formData.profileImage} 
              onUploadSuccess={(url) => handleChange('', 'profileImage', url)} 
            />
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Bio / About</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('', 'bio', e.target.value)}
                className="w-full min-h-[100px] rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-theme pb-4">
            <Mail className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-theme">Contact Information</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('', 'email', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('', 'phone', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('', 'location', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-theme pb-4">
            <Share2 className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-theme">Social Links</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">GitHub</label>
              <input
                type="text"
                value={formData.socialLinks.github}
                onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">LinkedIn</label>
              <input
                type="text"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Twitter</label>
              <input
                type="text"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleChange('socialLinks', 'twitter', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Theme Settings */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-theme pb-4">
            <Palette className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-theme">Theme Settings</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Default Mode</label>
              <select
                value={formData.theme.defaultMode}
                onChange={(e) => handleChange('theme', 'defaultMode', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Primary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.theme.primaryColor}
                  onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                  className="h-12 w-12 rounded-lg border border-theme bg-theme p-1 outline-none cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.theme.primaryColor}
                  onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                  className="flex-1 rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEO Settings */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-theme pb-4">
            <Search className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-theme">SEO Settings</h3>
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Meta Title</label>
              <input
                type="text"
                value={formData.seo.metaTitle}
                onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Meta Description</label>
              <textarea
                value={formData.seo.metaDescription}
                onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
                className="w-full min-h-[80px] rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Keywords (comma separated)</label>
              <input
                type="text"
                value={formData.seo.keywords}
                onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme p-3 text-theme outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
