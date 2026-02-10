'use server';

import { prisma } from '@/lib/db';

export async function getEnquiries() {
    try {
        const enquiries = await prisma.enquiry.findMany({
            orderBy: { createdAt: 'desc' },
            include: { car: true },
        });
        return enquiries;
    } catch (error) {
        console.error("Failed to fetch enquiries:", error);
        return [];
    }
}
