import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Briefcase, FileText, Download, MapPin, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { trackActivity } from '../lib/analytics';

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

interface Resume {
  fileUrl: string;
  fileName: string;
}

export default function CV() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Navigated to /cv successfully');
    trackActivity('PAGE_VIEW', 'CV_UNIFIED');
    
    const fetchData = async () => {
      try {
        const [expRes, resumeRes] = await Promise.all([
          axios.get('/api/experience'),
          axios.get('/api/resume')
        ]);
        setExperiences(Array.isArray(expRes.data) ? expRes.data : []);
        setResume(resumeRes.data);
      } catch (error) {
        console.error('Error fetching CV data:', error);
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
            السيرة الذاتية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary-theme"
          >
            Experience & Professional Resume
          </motion.p>
        </div>

        {/* Experience Section */}
        <section className="mb-24">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Briefcase size={24} />
            </div>
            <h2 className="text-3xl font-bold text-theme">الخبرات المهنية</h2>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-3xl border border-theme bg-card-theme p-8 transition-all hover:border-orange-500/50"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-theme group-hover:text-orange-500 transition-colors">{exp.title}</h3>
                    <p className="font-medium text-secondary-theme">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-theme px-4 py-1 text-xs font-bold text-orange-500">
                      {exp.period}
                    </span>
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs text-secondary-theme">
                      <MapPin size={12} />
                      {exp.location}
                    </div>
                  </div>
                </div>
                <p className="text-secondary-theme leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Resume Section */}
        <section>
          <div className="mb-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <FileText size={24} />
              </div>
              <h2 className="text-3xl font-bold text-theme">ملف السيرة الذاتية</h2>
            </div>
            {resume && (
              <a
                href={resume.fileUrl}
                download={resume.fileName}
                className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-orange-600"
              >
                <Download size={18} />
                Download PDF
              </a>
            )}
          </div>

          {resume ? (
            <div className="relative aspect-[1/1.4] w-full overflow-hidden rounded-3xl border border-theme bg-card-theme shadow-2xl">
              <iframe
                src={`${resume.fileUrl}#toolbar=0`}
                className="h-full w-full"
                title="Resume Preview"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100 backdrop-blur-sm">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black"
                >
                  <ExternalLink size={20} />
                  Open Full View
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-theme py-20 text-center">
              <FileText size={48} className="mx-auto mb-4 text-neutral-800" />
              <p className="text-secondary-theme">No resume file uploaded yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
