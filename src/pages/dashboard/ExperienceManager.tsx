import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Save, Briefcase } from 'lucide-react';

interface Experience {
  _id: string;
  company: string;
  title: string;
  duration: string;
  description: string;
}

interface Resume {
  fileUrl: string;
  fileName: string;
}

export default function ExperienceManager() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    duration: '',
    description: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await axios.get('/api/experience');
      setExperience(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        company: exp.company || '',
        title: exp.title || '',
        duration: exp.duration || '',
        description: exp.description || ''
      });
    } else {
      setEditingExp(null);
      setFormData({
        company: '',
        title: '',
        duration: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await axios.put(`/api/experience/${editingExp._id}`, formData, config);
      } else {
        await axios.post('/api/experience', formData, config);
      }
      setIsModalOpen(false);
      fetchExperience();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      await axios.delete(`/api/experience/${id}`, config);
      fetchExperience();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Professional Experience</h2>
          <p className="text-sm text-neutral-400">Update your professional history.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-800"></div>)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-theme bg-card-theme">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-theme bg-theme">
                <th className="px-6 py-4 font-bold text-secondary-theme">Role & Company</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Duration</th>
                <th className="px-6 py-4 font-bold text-secondary-theme text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {experience.map((exp) => (
                <tr key={exp._id} className="group hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-orange-500">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-theme">{exp.title}</p>
                        <p className="text-xs text-secondary-theme">{exp.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {exp.duration}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(exp)}
                        className="rounded-lg bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {experience.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                    No experience entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingExp ? 'Edit Experience' : 'Add Experience'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                    placeholder="Tech Corp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Title / Role</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                    placeholder="Senior Developer"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="Jan 2020 - Present"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-32 w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="Describe your responsibilities..."
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white"
              >
                <Save size={18} />
                Save Experience
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
