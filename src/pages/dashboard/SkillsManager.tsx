import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Save, X, Award, BarChart } from 'lucide-react';

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  order: number;
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 80,
    category: 'Frontend',
    icon: '',
    order: 0
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('/api/skills');
      setSkills(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSkill) {
        await axios.put(`/api/skills/${editingSkill._id}`, formData, config);
      } else {
        await axios.post('/api/skills', formData, config);
      }
      setIsModalOpen(false);
      setEditingSkill(null);
      setFormData({ name: '', level: 80, category: 'Frontend', icon: '', order: 0 });
      fetchSkills();
    } catch (err) {
      setError('Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon || '',
      order: skill.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await axios.delete(`/api/skills/${id}`, config);
      fetchSkills();
    } catch (err) {
      setError('Failed to delete skill');
    }
  };

  if (loading && skills.length === 0) {
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
          <h2 className="text-2xl font-bold text-theme">Skills Management</h2>
          <p className="text-sm text-secondary-theme">Manage your technical skills and proficiency levels.</p>
        </div>
        <button
          onClick={() => {
            setEditingSkill(null);
            setFormData({ name: '', level: 80, category: 'Frontend', icon: '', order: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 p-4 text-sm text-red-500">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <motion.div
            key={skill._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-3xl border border-theme bg-card-theme p-6 transition-all hover:border-orange-500/50"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-theme">{skill.name}</h3>
                  <p className="text-xs text-secondary-theme">{skill.category}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(skill)}
                  className="rounded-lg bg-theme p-2 text-secondary-theme hover:text-orange-500"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="rounded-lg bg-theme p-2 text-secondary-theme hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-secondary-theme">Proficiency</span>
                <span className="text-orange-500">{skill.level}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-theme">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  className="h-full bg-orange-500"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg rounded-3xl border border-theme bg-card-theme p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-theme">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-secondary-theme hover:text-theme">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-theme">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-theme bg-theme px-4 py-3 text-theme focus:border-orange-500 focus:outline-none"
                    placeholder="e.g. React.js"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-theme">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-theme bg-theme px-4 py-3 text-theme focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Design">Design</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-theme">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full rounded-2xl border border-theme bg-theme px-4 py-3 text-theme focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-secondary-theme">Proficiency Level</label>
                    <span className="text-sm font-bold text-orange-500">{formData.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-theme accent-orange-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 py-3 font-bold text-black transition-all hover:bg-orange-600 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingSkill ? 'Update Skill' : 'Save Skill'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-theme bg-theme py-3 font-bold text-theme transition-all hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
