import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
