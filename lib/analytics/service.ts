import { analyticsCache } from './cache';
import { getUnifiedDashboardMetrics } from './queries';

export class AnalyticsService {
  async getDashboardData(days: number = 30) {
    const cacheKey = `dashboard:${days}`;
    
    // Check cache first
    const cached = analyticsCache.get(cacheKey);
    if (cached) return cached;

    // Fetch fresh data
    const data = await getUnifiedDashboardMetrics(days);
    
    // Cache for 60 seconds
    analyticsCache.set(cacheKey, data);
    
    return data;
  }

  invalidateCache() {
    analyticsCache.invalidate('dashboard');
  }
}

export const analyticsService = new AnalyticsService();
