import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'PAGE_VIEW', 'PROJECT_CLICK'
  identifier: { type: String, required: true }, // 'HOME', 'PROJECTS', 'RESUME', or Project ID
  count: { type: Number, default: 1 },
  lastUpdated: { type: Date, default: Date.now }
});

// Compound index for efficient lookups
AnalyticsSchema.index({ type: 1, identifier: 1 }, { unique: true });

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
