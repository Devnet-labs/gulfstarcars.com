'use server';

import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/mail';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminReplyTemplate } from '@/lib/email-templates';

// Schema for input validation
const replySchema = z.object({
    enquiryId: z.string().min(1, "Enquiry ID is required"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function replyToEnquiry(prevState: any, formData: FormData) {
    try {
        // ... (validation and fetching remains the same)
        const rawData = {
            enquiryId: formData.get('enquiryId'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        const validatedData = replySchema.parse(rawData);

        // 1. Fetch user email from enquiry
        const enquiry = await prisma.enquiry.findUnique({
            where: { id: validatedData.enquiryId },
        });

        if (!enquiry || !enquiry.userEmail) {
            return { success: false, error: "Enquiry not found or missing email" };
        }

        // 2. Send Email using Professional Template
        // The template now handles the "Hi [Name]" and signature, so we just pass the message body.
        // However, if the admin types "Hi John," manually, it might be double. 
        // Typically admin interface for reply is just the message body.
        // 2. Send Email using Professional Template
        const emailHtml = getAdminReplyTemplate(enquiry.userName, validatedData.message);

        console.log("Generating Reply Email:", {
            to: enquiry.userEmail,
            subject: validatedData.subject,
            htmlLength: emailHtml.length,
            hasDoctype: emailHtml.includes('<!DOCTYPE html>')
        });

        const emailResult = await sendEmail({
            to: enquiry.userEmail,
            subject: validatedData.subject,
            text: validatedData.message, // Plain text fallback
            html: emailHtml,
        });

        if (!emailResult.success) {
            return { success: false, error: "Failed to send email via SMTP provider" };
        }

        // 3. Update Enquiry Status
        await prisma.enquiry.update({
            where: { id: validatedData.enquiryId },
            data: { status: 'REPLIED' },
        });

        revalidatePath('/admin/enquiries');
        return { success: true, message: "Reply sent successfully!" };

    } catch (error) {
        console.error("Reply Action Error:", error);
        return { success: false, error: "Failed to process reply" };
    }
}
