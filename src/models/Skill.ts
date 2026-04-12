import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, default: 'General' },
  icon: { type: String }, // Can be a Lucide icon name or image URL
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
