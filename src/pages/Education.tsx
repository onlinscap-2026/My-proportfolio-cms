import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { GraduationCap, Calendar, Loader2, Award } from 'lucide-react';
import { trackActivity } from '../lib/analytics';

interface Education {
  _id: string;
  institution: string;
  degree: string;
  year: string;
}

export default function Education() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'EDUCATION');
    const fetchEducation = async () => {
      try {
        const res = await axios.get('/api/education');
        setEducation(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
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
            التعليم
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary-theme"
          >
            Academic background and educational achievements.
          </motion.p>
        </div>

        <div className="space-y-8">
          {education.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-16 w-16 text-neutral-600 mb-4" />
              <p className="text-neutral-500">No education entries available.</p>
            </div>
          ) : (
            education.map((edu, index) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-theme bg-card-theme p-8 transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-all group-hover:bg-orange-500 group-hover:text-black">
                    <GraduationCap size={32} />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-theme">{edu.degree}</h3>
                        <p className="text-lg text-secondary-theme">{edu.institution}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Calendar size={16} />
                        {edu.year}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-orange-500">
                      <Award size={16} />
                      <span>Degree Completed</span>
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