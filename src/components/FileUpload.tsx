import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string, fileName: string) => void;
  label: string;
  accept?: string;
  currentUrl?: string;
}

export default function FileUpload({ onUploadSuccess, label, accept = "image/*", currentUrl }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onUploadSuccess(res.data.fileUrl, res.data.fileName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-secondary-theme uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-4">
        {currentUrl && (
          <div className="h-12 w-12 overflow-hidden rounded-lg border border-theme bg-theme">
            {accept.includes('image') ? (
              <img src={currentUrl} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-orange-500">
                <Upload size={20} />
              </div>
            )}
          </div>
        )}
        <div className="relative flex-1">
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            disabled={uploading}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`flex cursor-pointer items-center justify-between rounded-xl border border-theme bg-theme px-4 py-3 text-sm transition-all hover:border-orange-500 ${uploading ? 'opacity-50' : ''}`}
          >
            <span className="text-secondary-theme truncate max-w-[150px]">
              {uploading ? 'Uploading...' : 'Choose file...'}
            </span>
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-orange-500" />
            ) : success ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : error ? (
              <XCircle size={18} className="text-red-500" />
            ) : (
              <Upload size={18} className="text-orange-500" />
            )}
          </label>
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
