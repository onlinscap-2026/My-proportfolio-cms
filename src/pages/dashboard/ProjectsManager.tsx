import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Link as LinkIcon, Github, ExternalLink, Upload } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  link?: string;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    link: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        techStack: project.techStack ? project.techStack.join(', ') : '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        link: project.link || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        techStack: '',
        liveUrl: '',
        githubUrl: '',
        link: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject._id}`, data, config);
      } else {
        await axios.post('/api/projects', data, config);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`, config);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-theme">Manage Projects</h2>
          <p className="text-sm text-secondary-theme">Add, edit, or remove projects from your portfolio.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Project
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
                <th className="px-6 py-4 font-bold text-secondary-theme">Project</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Tech Stack</th>
                <th className="px-6 py-4 font-bold text-secondary-theme">Links</th>
                <th className="px-6 py-4 font-bold text-secondary-theme text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {projects.map((project) => (
                <tr key={project._id} className="group hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-10 w-10 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-theme">{project.title}</p>
                        <p className="text-xs text-secondary-theme line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map(tech => (
                        <span key={tech} className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {project.liveUrl && <ExternalLink size={14} className="text-orange-500" />}
                      {project.githubUrl && <Github size={14} className="text-neutral-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="rounded-lg bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No projects found.
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
              <h3 className="text-xl font-bold text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                    placeholder="E-commerce Platform"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-24 w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="Describe your project..."
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FileUpload 
                  label="Project Image" 
                  currentUrl={formData.image} 
                  onUploadSuccess={(url) => setFormData({ ...formData, image: url })} 
                />
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Project Link (Alt)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">Live URL</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                      type="text"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">GitHub URL</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                      type="text"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500"
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white"
              >
                <Save size={18} />
                {editingProject ? 'Update Project' : 'Save Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
