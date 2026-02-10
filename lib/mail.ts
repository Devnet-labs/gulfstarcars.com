import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_APP_PASSWORD;

    if (!host || !user || !pass) {
        console.warn('SMTP credentials not set. Skipping email send.');
        console.log('Mock Email Content:', { to, subject });
        return { success: false, error: 'Email credentials not set' };
    }

    console.log(`Sending email to ${to} with subject "${subject}" (HTML length: ${html?.length || 0})`);

    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure, // true for 465, false for other ports
            auth: {
                user,
                pass,
            },
        });

        // Verify connection configuration
        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"Gulfstarscars" <${user}>`,
            to,
            subject,
            html: html || text.replace(/\n/g, '<br>'),
            text, // Text version as fallback
        });

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
