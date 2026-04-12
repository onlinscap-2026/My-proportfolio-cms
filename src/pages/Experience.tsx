import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, Loader2, ArrowRight, Download } from 'lucide-react';
import { trackActivity } from '../lib/analytics';

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  order: number;
}

interface Resume {
  fileUrl: string;
  fileName: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'EXPERIENCE');
    const fetchData = async () => {
      try {
        const [expRes, resumeRes] = await Promise.all([
          axios.get('/api/experience'),
          axios.get('/api/resume')
        ]);
        setExperiences(Array.isArray(expRes.data) ? expRes.data : []);
        setResume(resumeRes.data);
      } catch (error) {
        console.error('Error fetching experience data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
            الخبرات المهنية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary-theme"
          >
            Professional journey and career milestones.
          </motion.p>

          {resume && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-4"
            >
              <a
                href={resume.fileUrl}
                download={resume.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-sm font-bold text-black transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <Download size={18} />
                Download Resume
              </a>
            </motion.div>
          )}
        </div>

        <div className="relative space-y-12 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-theme md:before:left-1/2 md:before:-translate-x-1/2">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row md:items-center ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Dot on timeline */}
              <div className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-theme bg-orange-500 md:left-1/2" />

              <div className="w-full md:w-1/2 md:px-12">
                <div className="rounded-3xl border border-theme bg-card-theme p-8 transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-orange-500/10 px-4 py-1 text-xs font-bold text-orange-500">
                      {exp.period}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-secondary-theme">
                      <MapPin size={12} />
                      {exp.location}
                    </div>
                  </div>
                  
                  <h3 className="mb-1 text-2xl font-bold text-theme">{exp.title}</h3>
                  <p className="mb-4 text-lg font-medium text-orange-500">{exp.company}</p>
                  
                  <p className="text-secondary-theme leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {experiences.length === 0 && (
            <div className="py-20 text-center">
              <Briefcase size={48} className="mx-auto mb-4 text-neutral-800" />
              <p className="text-secondary-theme">No experience records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
