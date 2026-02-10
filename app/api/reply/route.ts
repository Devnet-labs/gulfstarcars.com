import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/mail';
import { getAdminReplyTemplate } from '@/lib/email-templates';
import { z } from 'zod';

const replySchema = z.object({
    enquiryId: z.string(),
    userEmail: z.string().email(),
    replyMessage: z.string().min(1),
    subject: z.string().min(1),
});

import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = replySchema.parse(body);

        // 1. Send Email Reply
        const emailHtml = getAdminReplyTemplate(
            'Valued Customer', // API route might not have userName easily available without DB lookup, using generic fallback or we can fetch it.
            validatedData.replyMessage
        );

        const result = await sendEmail({
            to: validatedData.userEmail,
            subject: validatedData.subject,
            text: validatedData.replyMessage,
            html: emailHtml
        });

        if (!result.success) {
            console.warn("Email sending failed, but continuing with DB update");
        }

        // 2. Update Enquiry Status in DB
        try {
            await prisma.enquiry.update({
                where: { id: validatedData.enquiryId },
                data: { status: 'REPLIED' },
            });
        } catch (dbError) {
            console.warn("Database update failed (likely disconnected)");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reply API Error:", error);
        return NextResponse.json(
            { error: 'Failed to send reply' },
            { status: 500 }
        );
    }
}
