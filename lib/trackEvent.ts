'use client';

// Deduplication cache
const eventCache = new Map<string, number>();
const DEDUP_WINDOW = 5000; // 5 seconds

export async function trackEvent(eventType: string, data: Record<string, string>) {
  const cacheKey = `${eventType}:${JSON.stringify(data)}`;
  const now = Date.now();
  const lastTracked = eventCache.get(cacheKey);

  // Deduplicate within 5 seconds
  if (lastTracked && now - lastTracked < DEDUP_WINDOW) {
    return;
  }

  eventCache.set(cacheKey, now);

  try {
    await fetch('/api/track-event', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, data }),
    });
  } catch (err) {
    console.error('Failed to track event', err);
  }
}
