import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/mail';
import { getEnquiryReceivedTemplate } from '@/lib/email-templates';
import { z } from 'zod';

const enquirySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
    carId: z.string().optional(),
    carName: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = enquirySchema.parse(body);

        // 1. Save to Database
        let savedEnquiry;
        try {
            savedEnquiry = await prisma.enquiry.create({
                data: {
                    userName: validatedData.name,
                    userEmail: validatedData.email,
                    message: validatedData.message,
                    carId: validatedData.carId,
                },
            });
        } catch (dbError) {
            console.warn("Database error (likely not connected):", dbError);
        }

        // 2. Send Admin Notification
        const adminEmail = process.env.SMTP_EMAIL;
        if (adminEmail) {
            // Using fire-and-forget for speed, but catching errors to prevent crash
            sendEmail({
                to: adminEmail,
                subject: `New Enquiry: ${validatedData.carName || 'General Enquiry'}`,
                text: `
                    Name: ${validatedData.name}
                    Email: ${validatedData.email}
                    Car: ${validatedData.carName || 'N/A'}
                    
                    Message:
                    ${validatedData.message}
                `,
            }).catch(e => console.error("Failed to send admin notification:", e));
        }

        // 3. Send User Confirmation (Professional Template)
        const emailHtml = getEnquiryReceivedTemplate(
            validatedData.name,
            validatedData.carName,
            validatedData.message
        );

        // Send confirmation email (awaiting to ensure delivery before response, or handle err)
        await sendEmail({
            to: validatedData.email,
            subject: `We received your enquiry! - Gulfstarscars`,
            text: `Hello ${validatedData.name}, Thank you for your enquiry about ${validatedData.carName || 'our services'}. We will get back to you shortly.`,
            html: emailHtml
        });

        return NextResponse.json({ success: true, id: savedEnquiry?.id });
    } catch (error) {
        console.error("Enquiry API Error:", error);
        return NextResponse.json(
            { error: 'Failed to process enquiry' },
            { status: 500 }
        );
    }
}
