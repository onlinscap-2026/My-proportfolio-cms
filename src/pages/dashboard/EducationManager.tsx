import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Save, GraduationCap } from 'lucide-react';

interface Education {
  _id: string;
  institution: string;
  degree: string;
  year: string;
}

export default function EducationManager() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    year: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchEducation();
  }, []);

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

  const handleOpenModal = (edu?: Education) => {
    if (edu) {
      setEditingEdu(edu);
      setFormData({
        institution: edu.institution || '',
        degree: edu.degree || '',
        year: edu.year || ''
      });
    } else {
      setEditingEdu(null);
      setFormData({
        institution: '',
        degree: '',
        year: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        await axios.put(`/api/education/${editingEdu._id}`, formData, config);
      } else {
        await axios.post('/api/education', formData, config);
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;
    try {
      await axios.delete(`/api/education/${id}`, config);
      fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Education</h2>
          <p className="text-sm text-neutral-400">Update your academic background.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-800"></div>)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-theme bg-card-theme">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-theme bg-theme">
                <th className="px-6 py-4 font-bold text-secondary-theme">Degree & Institution</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Year</th>
                <th className="px-6 py-4 font-bold text-secondary-theme text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {education.map((edu) => (
                <tr key={edu._id} className="group hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-orange-500">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-theme">{edu.degree}</p>
                        <p className="text-xs text-secondary-theme">{edu.institution}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {edu.year}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(edu)}
                        className="rounded-lg bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu._id)}
                        className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {education.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                    No education entries found.
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
              <h3 className="text-xl font-bold text-white">{editingEdu ? 'Edit Education' : 'Add Education'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="University of Technology"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="B.Sc. in Computer Science"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="2016 - 2020"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white"
              >
                <Save size={18} />
                Save Education
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
