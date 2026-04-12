import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, FileText, Loader2, ExternalLink, Trash2, Upload } from 'lucide-react';

interface Resume {
  _id?: string;
  fileUrl: string;
  fileName: string;
  updatedAt?: string;
}

export default function ResumeManager() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fileUrl: '',
    fileName: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get('/api/resume');
      if (res.data) {
        setResume(res.data);
        setFormData({
          fileUrl: res.data.fileUrl,
          fileName: res.data.fileName
        });
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/upload', uploadFormData, {
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/resume', formData, config);
      alert('Resume updated successfully!');
      fetchResume();
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resume?._id) return;
    if (!window.confirm('Are you sure you want to delete the resume record?')) return;
    
    try {
      await axios.delete(`/api/resume/${resume._id}`, config);
      setResume(null);
      setFormData({ fileUrl: '', fileName: '' });
      alert('Resume deleted successfully!');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-theme">Resume Management</h2>
        <p className="text-sm text-secondary-theme">Manage your professional resume file and preview.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <section className="rounded-3xl border border-theme bg-card-theme p-8">
          <div className="mb-8 space-y-4">
            <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Upload New Resume</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
                disabled={uploading}
              />
              <label
                htmlFor="resume-upload"
                className={`flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-theme bg-theme/50 py-10 transition-all hover:border-orange-500 hover:bg-orange-500/5 ${uploading ? 'opacity-50' : ''}`}
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                      <Upload size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-theme">Click to upload PDF</p>
                      <p className="text-xs text-secondary-theme">Max file size: 10MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="relative mb-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-theme"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-theme">OR ENTER URL</span>
            <div className="h-[1px] flex-1 bg-theme"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">Resume File URL</label>
                <input
                  type="text"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full rounded-xl border border-theme bg-theme p-4 text-sm text-theme outline-none focus:border-orange-500 transition-all"
                  placeholder="https://example.com/resume.pdf"
                  required
                />
                <p className="text-[10px] text-secondary-theme">Provide a direct link to your PDF file (Google Drive, Dropbox, or custom CDN).</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">File Name (Display)</label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-white outline-none focus:border-orange-500 transition-all"
                  placeholder="John_Doe_Resume.pdf"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
              
              {resume && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center justify-center rounded-xl bg-red-500/10 px-6 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Preview Section */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Live Preview</h3>
            {resume && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-orange-500 hover:underline"
              >
                <ExternalLink size={12} />
                Open Original
              </a>
            )}
          </div>

          {formData.fileUrl ? (
            <div className="relative aspect-[1/1.4] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
              <iframe
                src={`${formData.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="h-full w-full"
                title="Resume Preview"
              />
            </div>
          ) : (
            <div className="flex aspect-[1/1.4] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 text-center">
              <FileText size={48} className="mb-4 text-neutral-800" />
              <p className="text-sm text-neutral-500">Enter a URL to see the preview</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
