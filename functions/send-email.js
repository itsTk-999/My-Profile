import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, phone, company, subject, message } = JSON.parse(event.body);

  const payload = {
    sender: { email: process.env.SENDER_EMAIL },
    to: [{ email: process.env.RECIPIENT_EMAIL }],
    subject,
    htmlContent: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const respBody = await response.text();
    console.log('Brevo response status:', response.status);
    console.log('Brevo response body:', respBody);

    if (response.ok) {
      return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully' }) };
    } else {
      return { statusCode: response.status, body: respBody };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
}
