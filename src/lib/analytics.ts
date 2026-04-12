import axios from 'axios';

export const trackActivity = async (type: 'PAGE_VIEW' | 'PROJECT_CLICK', identifier: string) => {
  try {
    await axios.post('/api/analytics/track', { type, identifier });
  } catch (error) {
    // Silent fail for analytics
    console.debug('Analytics tracking failed:', identifier);
  }
};
