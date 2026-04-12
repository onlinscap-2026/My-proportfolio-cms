import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String }, // User requested 'link'
  techStack: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
