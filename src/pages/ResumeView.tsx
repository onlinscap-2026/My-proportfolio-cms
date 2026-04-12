import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Download, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackActivity } from '../lib/analytics';

interface Resume {
  fileUrl: string;
  fileName: string;
}

export default function ResumeView() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'RESUME');
    const fetchResume = async () => {
      try {
        const res = await axios.get('/api/resume');
        setResume(res.data);
      } catch (error) {
        console.error('Error fetching resume:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
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
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary-theme hover:text-orange-500 transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-theme sm:text-5xl">Curriculum Vitae</h1>
            <p className="text-secondary-theme">Professional background and technical expertise.</p>
          </div>
          
          {resume && (
            <a
              href={resume.fileUrl}
              download={resume.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-sm font-bold text-black transition-all hover:bg-orange-600 hover:scale-105"
            >
              <Download size={18} />
              Download PDF
            </a>
          )}
        </div>

        {resume ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[1/1.4] w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-orange-500/5"
          >
            <iframe
              src={`${resume.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="h-full w-full"
              title="Resume Preview"
            />
            
            {/* Overlay for mobile or if iframe fails */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/50 p-8 text-center backdrop-blur-sm sm:hidden">
              <FileText size={48} className="mb-4 text-orange-500" />
              <h3 className="mb-2 text-xl font-bold text-white">Resume Preview</h3>
              <p className="mb-6 text-sm text-neutral-400">Preview is best viewed on larger screens. You can still download the file below.</p>
              <a
                href={resume.fileUrl}
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
              >
                Open PDF
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-800 py-32 text-center">
            <FileText size={48} className="mb-4 text-neutral-700" />
            <h3 className="text-xl font-bold text-white">No Resume Found</h3>
            <p className="text-neutral-500">The resume hasn't been uploaded yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
