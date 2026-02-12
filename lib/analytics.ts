import { createHash } from 'crypto';

// ─── Constants ───────────────────────────────────────────────────────
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;   // 30 minutes
export const DEDUP_WINDOW_MS = 5 * 1000;             // 5 seconds
export const VISITOR_COOKIE_NAME = 'visitor_id';
export const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// ─── IP Hashing (SHA-256, not reversible) ────────────────────────────
export function hashIp(ip: string): string {
    return createHash('sha256').update(ip).digest('hex');
}

// ─── User-Agent Parsing ──────────────────────────────────────────────
export function parseUserAgent(ua: string | null): {
    browser: string;
    os: string;
    device: string;
} {
    if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' };

    const browser =
        ua.includes('Edg/') ? 'Edge' :
            ua.includes('Chrome/') ? 'Chrome' :
                ua.includes('Firefox/') ? 'Firefox' :
                    ua.includes('Safari/') ? 'Safari' :
                        ua.includes('Opera/') || ua.includes('OPR/') ? 'Opera' : 'Other';

    const os =
        ua.includes('Win') ? 'Windows' :
            ua.includes('Mac') ? 'macOS' :
                ua.includes('Linux') ? 'Linux' :
                    ua.includes('Android') ? 'Android' :
                        ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' : 'Other';

    const device =
        ua.includes('Mobi') || ua.includes('Android') || ua.includes('iPhone') ? 'Mobile' :
            ua.includes('iPad') || ua.includes('Tablet') ? 'Tablet' : 'Desktop';

    return { browser, os, device };
}

// ─── Country Detection ───────────────────────────────────────────────
export function detectCountry(headersList: Headers): string {
    return (
        headersList.get('x-vercel-ip-country') ||
        headersList.get('cf-ipcountry') ||
        'Unknown'
    );
}
