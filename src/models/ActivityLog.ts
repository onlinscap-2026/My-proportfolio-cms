import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true }, // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  targetType: { type: String, required: true }, // 'PROJECT', 'EXPERIENCE', 'EDUCATION', 'RESUME', 'AUTH'
  targetId: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
