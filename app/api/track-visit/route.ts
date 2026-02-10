import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        // Vercel / Cloudflare headers for country
        const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || 'Unknown';
        const ip = headersList.get('x-forwarded-for') || 'unknown-ip';

        // Simple hash for privacy (in real app usage appropriate hashing)
        const ipHash = Buffer.from(ip).toString('base64');

        try {
            await prisma.visit.create({
                data: {
                    country,
                    ipHash,
                },
            });
        } catch (e) {
            console.warn("Failed to record visit in DB (likely disconnected)");
        }

        return NextResponse.json({ success: true, country });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to track visit' },
            { status: 500 }
        );
    }
}
