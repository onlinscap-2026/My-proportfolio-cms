import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  highlights: [{ type: String }],
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const About = mongoose.models.About || mongoose.model('About', AboutSchema);