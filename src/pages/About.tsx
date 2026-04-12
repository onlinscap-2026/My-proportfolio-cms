import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { User, Loader2, Award, CheckCircle } from 'lucide-react';
import { trackActivity } from '../lib/analytics';

interface About {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
  highlights: string[];
  order: number;
}

export default function About() {
  const [about, setAbout] = useState<About[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'ABOUT');
    const fetchAbout = async () => {
      try {
        const res = await axios.get('/api/about');
        setAbout(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching about:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 space-y-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-theme sm:text-6xl"
          >
            About Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary-theme"
          >
            Get to know me better and learn about my journey.
          </motion.p>
        </div>

        <div className="space-y-12">
          {about.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-16 w-16 text-neutral-600 mb-4" />
              <p className="text-neutral-500">About me content is coming soon.</p>
            </div>
          ) : (
            about.map((section, index) => (
              <motion.div
                key={section._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-theme bg-card-theme p-8 sm:p-12"
              >
                <div className="space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-all group-hover:bg-orange-500 group-hover:text-black">
                      <User size={32} />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-theme sm:text-3xl">
                          {section.title}
                        </h2>
                        {section.subtitle && (
                          <p className="text-lg text-secondary-theme mt-2">
                            {section.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <p className="text-lg leading-relaxed text-secondary-theme whitespace-pre-line">
                          {section.content}
                        </p>
                      </div>

                      {section.highlights && section.highlights.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-theme flex items-center gap-2">
                            <Award size={20} />
                            Key Highlights
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {section.highlights.map((highlight, highlightIndex) => (
                              <div
                                key={highlightIndex}
                                className="flex items-start gap-3 rounded-lg border border-theme bg-theme/50 p-4"
                              >
                                <CheckCircle size={16} className="mt-0.5 text-orange-500 flex-shrink-0" />
                                <span className="text-sm text-secondary-theme">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}