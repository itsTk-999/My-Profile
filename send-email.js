const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { name, email, phone, company, subject, message } = JSON.parse(event.body);

        // Brevo API configuration
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

        const emailData = {
            sender: {
                name: 'Portfolio Contact Form',
                email: 'noreply@yourdomain.com' // Use your verified sender email
            },
            to: [
                {
                    email: 'your-email@gmail.com', // Your receiving email
                    name: 'Lil Tk'
                }
            ],
            subject: `New Contact: ${subject}`,
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #00A86B; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #333; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Contact Form Submission</h1>
                        </div>
                        <div class="content">
                            <div class="field">
                                <span class="label">Name:</span> ${name}
                            </div>
                            <div class="field">
                                <span class="label">Email:</span> ${email}
                            </div>
                            ${phone ? `<div class="field"><span class="label">Phone:</span> ${phone}</div>` : ''}
                            ${company ? `<div class="field"><span class="label">Company:</span> ${company}</div>` : ''}
                            <div class="field">
                                <span class="label">Subject:</span> ${subject}
                            </div>
                            <div class="field">
                                <span class="label">Message:</span>
                                <p>${message.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `
                New Contact Form Submission
                ============================
                Name: ${name}
                Email: ${email}
                ${phone ? `Phone: ${phone}` : ''}
                ${company ? `Company: ${company}` : ''}
                Subject: ${subject}
                Message: ${message}
            `
        };

        const response = await fetch(BREVO_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send email');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' })
        };
    }
};