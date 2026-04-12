import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Award, Loader2, Code2, Database, Layout, Smartphone, Settings, Terminal } from 'lucide-react';
import { trackActivity } from '../lib/analytics';

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
}

const categoryIcons: Record<string, any> = {
  Frontend: Layout,
  Backend: Database,
  DevOps: Terminal,
  Design: Code2,
  Mobile: Smartphone,
  Other: Settings
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'SKILLS');
    const fetchSkills = async () => {
      try {
        const res = await axios.get('/api/skills');
        setSkills(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const categories = [...new Set(skills.map(s => s.category))] as string[];

  return (
    <div className="min-h-screen bg-theme px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 space-y-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-theme sm:text-6xl"
          >
            المهارات التقنية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-secondary-theme"
          >
            A comprehensive overview of my technical stack and proficiency levels across different domains.
          </motion.p>
        </div>

        <div className="space-y-20">
          {categories.map((category: string, catIndex) => {
            const CategoryIcon = categoryIcons[category] || Settings;
            const categorySkills = skills.filter(s => s.category === category);

            return (
              <section key={category} className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                    <CategoryIcon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-theme">{category}</h2>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group rounded-3xl border border-theme bg-card-theme p-6 transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-lg font-bold text-theme group-hover:text-orange-500 transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-sm font-bold text-orange-500">{skill.level}%</span>
                      </div>

                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-theme">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-orange-400"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {skills.length === 0 && (
          <div className="py-20 text-center">
            <Award size={48} className="mx-auto mb-4 text-neutral-800" />
            <p className="text-secondary-theme">No skills listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
