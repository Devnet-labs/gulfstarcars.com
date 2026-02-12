'use client';

import { useEffect, useRef } from 'react';

export function ProductViewTracker({ carId }: { carId: string }) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const tracked = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      maxScroll.current = Math.max(maxScroll.current, Math.min(scrollPercentage, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const sendTracking = () => {
      if (tracked.current) return;
      tracked.current = true;

      const durationMs = Date.now() - startTime.current;
      
      if (durationMs > 3000) {
        const source = document.referrer 
          ? (document.referrer.includes(window.location.hostname) ? 'internal' : 'referral')
          : 'direct';

        navigator.sendBeacon('/api/track-product-view', JSON.stringify({
          carId,
          durationMs,
          scrollDepth: Math.round(maxScroll.current),
          source,
          referer: document.referrer || null,
        }));
      }
    };

    window.addEventListener('beforeunload', sendTracking);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) sendTracking();
    });

    return () => {
      sendTracking();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', sendTracking);
    };
  }, [carId]);

  return null;
}
