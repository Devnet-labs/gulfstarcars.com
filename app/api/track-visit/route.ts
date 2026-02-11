import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

function parseUA(ua: string | null) {
    if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' };

    const browser =
        ua.includes('Edg/') ? 'Edge' :
            ua.includes('Chrome/') ? 'Chrome' :
                ua.includes('Safari/') ? 'Safari' :
                    ua.includes('Firefox/') ? 'Firefox' :
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, referer } = body;

        const headersList = await headers();
        const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || 'Unknown';
        const ip = headersList.get('x-forwarded-for') || 'unknown-ip';
        const userAgentString = headersList.get('user-agent') || '';

        const { browser, os, device } = parseUA(userAgentString);
        const ipHash = Buffer.from(ip).toString('base64');

        try {
            await prisma.visit.create({
                data: {
                    country,
                    ipHash,
                    path: path || '/',
                    userAgent: userAgentString,
                    browser,
                    os,
                    device,
                    referer: referer || null,
                },
            });
        } catch (e) {
            console.warn("Failed to record visit in DB", e);
        }

        return NextResponse.json({ success: true, country });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to track visit' },
            { status: 500 }
        );
    }
}
