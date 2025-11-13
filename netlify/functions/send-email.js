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
                email: 'liltk0998@gmail.com' // ← CHANGE THIS to a verified sender
            },
            to: [
                {
                    email: 'liltk0998@gmail.com', // Your receiving email
                    name: 'Lil Tk'
                }
            ],
            replyTo: {
                email: email, // So you can reply directly to the person who filled the form
                name: name
            },
            subject: `New Portfolio Contact: ${subject}`,
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

        console.log('Sending email with data:', JSON.stringify(emailData, null, 2));

        const response = await fetch(BREVO_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const responseData = await response.json();
        console.log('Brevo API Response:', response.status, responseData);

        if (!response.ok) {
            throw new Error(responseData.message || `Brevo API error: ${response.status}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Email sent successfully',
                brevoResponse: responseData 
            })
        };

    } catch (error) {
        console.error('Error in send-email function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: error.message || 'Internal server error',
                details: 'Check Netlify function logs for more information'
            })
        };
    }
};