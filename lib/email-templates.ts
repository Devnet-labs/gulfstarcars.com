// Use env so logo and links work in all environments; fix typo: was gulfstarscars.com (wrong)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gulfstarcars.com';

export const BaseEmailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gulfstarscars</title>
    <style>
        body { margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #ffffff; padding-bottom: 40px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { padding: 40px 0 20px; text-align: center; border-bottom: 1px solid #eaeaea; }
        .logo { height: 40px; width: auto; }
        .body { padding: 30px 20px; line-height: 1.6; font-size: 16px; color: #333333; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea; background-color: #fafafa; }
        .footer a { color: #888888; text-decoration: underline; margin: 0 5px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500; margin-top: 15px; }
        p { margin: 0 0 16px; }
        .message-box { background-color: #f9f9f9; border-left: 3px solid #000000; padding: 15px; margin: 20px 0; font-style: italic; color: #555555; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header with Logo - absolute URL so email clients can load the image -->
            <div class="header" style="padding: 40px 0 20px; text-align: center; border-bottom: 1px solid #eaeaea; background-color: #0f172a;">
                <img src="${BASE_URL}/images/portfolio/logo/logo.png" alt="Gulf Star Cars" width="200" style="height: auto; width: 200px; display: block; margin: 0 auto; border: 0;">
            </div>

            <!-- Main Content -->
            <div class="body">
                ${content}
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>Gulf Star Cars Import & Export<br>
                Dubai Automarket, Ras Al Khor, Dubai, UAE</p>
                <div style="margin-top: 10px;">
                    <a href="${BASE_URL}">Website</a>
                    <a href="${BASE_URL}/contact">Contact</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const getEnquiryReceivedTemplate = (name: string, carName?: string, message?: string) => {
    // Human, direct, professional copy.
    const content = `
        <p>Hi ${name},</p>
        <p>Thanks for getting in touch with us regarding <strong>${carName || 'our services'}</strong>.</p>
        <p>We've received your message and our team is looking into it. You can expect a response from us within the next 24 hours.</p>
        
        ${message ? `
        <div class="message-box">
            "${message}"
        </div>
        ` : ''}

        <p>Best regards,<br>Gulfstarscars Team</p>
    `;
    return BaseEmailLayout(content);
};

export const getAdminReplyTemplate = (userName: string, message: string) => {
    // Wraps the admin's raw message in the branded template.
    const content = `
        <p>Hi ${userName},</p>
        
        <div>
            ${message.replace(/\n/g, '<br>')}
        </div>
        
        <p style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px; font-size: 14px; color: #666;">
            If you have more questions, feel free to reply directly to this email.
        </p>

        <p>Best,<br>Gulfstarscars Team</p>
    `;
    return BaseEmailLayout(content);
};
