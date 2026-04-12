import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Save, User } from 'lucide-react';

interface About {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
  highlights: string[];
  order: number;
}

export default function AboutManager() {
  const [about, setAbout] = useState<About[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAbout, setEditingAbout] = useState<About | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    highlights: [''],
    order: 0
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAbout();
  }, []);

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

  const handleOpenModal = (aboutItem?: About) => {
    if (aboutItem) {
      setEditingAbout(aboutItem);
      setFormData({
        title: aboutItem.title || '',
        subtitle: aboutItem.subtitle || '',
        content: aboutItem.content || '',
        highlights: aboutItem.highlights?.length > 0 ? aboutItem.highlights : [''],
        order: aboutItem.order || 0
      });
    } else {
      setEditingAbout(null);
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        highlights: [''],
        order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty highlights
      const cleanedFormData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim() !== '')
      };

      if (editingAbout) {
        await axios.put(`/api/about/${editingAbout._id}`, cleanedFormData, config);
      } else {
        await axios.post('/api/about', cleanedFormData, config);
      }
      setIsModalOpen(false);
      fetchAbout();
    } catch (error) {
      console.error('Error saving about:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this about section?')) return;
    try {
      await axios.delete(`/api/about/${id}`, config);
      fetchAbout();
    } catch (error) {
      console.error('Error deleting about:', error);
    }
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, '']
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({
      ...formData,
      highlights: newHighlights
    });
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage About Me</h2>
          <p className="text-sm text-neutral-400">Create and manage your about me content sections.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-orange-600"
        >
          <Plus size={18} />
          Add About Section
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral-800"></div>)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-theme bg-card-theme">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-theme bg-theme">
                <th className="px-6 py-4 font-bold text-secondary-theme">Title</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Subtitle</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Order</th>
                <th className="px-6 py-4 font-bold text-secondary-theme text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {about.map((item) => (
                <tr key={item._id} className="group hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-orange-500">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-theme">{item.title}</p>
                        <p className="text-xs text-secondary-theme line-clamp-2">{item.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {item.subtitle || '-'}
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {item.order}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="rounded-lg bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {about.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No about sections found. Add your first about section.
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
          <div className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingAbout ? 'Edit About Section' : 'Add About Section'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                    placeholder="About Me"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="A brief subtitle"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500 min-h-[120px] resize-y"
                  placeholder="Tell your story..."
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-400">Highlights (Optional)</label>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="text-xs text-orange-500 hover:text-orange-400"
                  >
                    + Add Highlight
                  </button>
                </div>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                      placeholder="Key achievement or skill"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-500 hover:bg-red-500/20"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white"
              >
                <Save size={18} />
                Save About Section
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}