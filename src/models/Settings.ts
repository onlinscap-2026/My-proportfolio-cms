import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'ProPortfolio' },
  logoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },
  description: { type: String, default: 'A professional portfolio system.' },

  fullName: { type: String, default: 'John Doe' },
  jobTitle: { type: String, default: 'Full Stack Engineer' },
  bio: { type: String, default: "I'm a Full Stack Engineer specializing in building high-performance web applications with modern technologies." },
  profileImage: { type: String, default: '' },

  email: { type: String, default: 'hello@proportfolio.com' },
  phone: { type: String, default: '' },
  location: { type: String, default: 'San Francisco, CA' },

  socialLinks: {
    github: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    twitter: { type: String, default: '#' }
  },

  theme: {
    defaultMode: { type: String, enum: ['dark', 'light'], default: 'dark' },
    primaryColor: { type: String, default: '#f97316' } // orange-500
  },

  seo: {
    metaTitle: { type: String, default: 'ProPortfolio | Full Stack Engineer' },
    metaDescription: { type: String, default: 'Professional portfolio of a Full Stack Engineer.' },
    keywords: { type: String, default: 'portfolio, developer, engineer, react, nodejs' }
  },

  updatedAt: { type: Date, default: Date.now }
});

export const Settings = mongoose.model('Settings', settingsSchema);
