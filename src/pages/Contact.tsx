import { motion } from 'motion/react';
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send, CheckCircle, AlertCircle, MapPin, Phone, Linkedin, Twitter, Github } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-bold tracking-tight sm:text-7xl"
            >
              Let's <br />
              <span className="text-orange-500 text-6xl sm:text-8xl">Connect.</span>
            </motion.h1>
            <p className="max-w-md text-lg text-neutral-400">
              Have a project in mind or just want to say hi? Feel free to reach out. 
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-orange-500">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-theme">Email Me</p>
                <p className="text-lg font-medium text-theme">{settings?.email || 'hello@proportfolio.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-orange-500">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-theme">Phone</p>
                <p className="text-lg font-medium text-theme">{settings?.phone || '+1 (555) 123-4567'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-orange-500">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-theme">Location</p>
                <p className="text-lg font-medium text-theme">{settings?.location || 'San Francisco, CA'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { icon: Github, link: settings?.socialLinks.github },
              { icon: Linkedin, link: settings?.socialLinks.linkedin },
              { icon: Twitter, link: settings?.socialLinks.twitter }
            ].filter(s => s.link && s.link !== '#').map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-theme bg-card-theme text-secondary-theme transition-all hover:border-orange-500 hover:text-orange-500"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-theme bg-card-theme p-8 sm:p-12 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-theme">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-theme bg-theme p-4 text-theme outline-none focus:border-orange-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-theme">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-theme bg-theme p-4 text-theme outline-none focus:border-orange-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-theme">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="h-40 w-full rounded-2xl border border-theme bg-theme p-4 text-theme outline-none focus:border-orange-500"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-5 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white disabled:opacity-50"
            >
              {status === 'loading' ? (
                'Sending...'
              ) : (
                <>
                  Send Message
                  <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 rounded-xl bg-green-500/10 p-4 text-sm font-medium text-green-500 border border-green-500/20">
                <CheckCircle size={18} />
                Message sent successfully! I'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-500 border border-red-500/20">
                <AlertCircle size={18} />
                Something went wrong. Please try again later.
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
