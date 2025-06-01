import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: ContactFormData = await request.json();
    const { name, email, subject, message, turnstileToken } = body;

    // Validate form data
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile token
    const formData = new FormData();
    formData.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET || '');
    formData.append('response', turnstileToken);
    formData.append('remoteip', request.headers.get('x-forwarded-for') || '');

    const verifyResult = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const verification = await verifyResult.json();
    
    if (!verification.success) {
      return NextResponse.json(
        { message: 'Turnstile verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Prepare email
    const formattedSubject = subject 
      ? `[EduBrief Contact Form] ${subject}` 
      : '[EduBrief Contact Form] New Message';

    const msg = {
      to: process.env.CONTACT_EMAIL || 'admin@example.com',
      from: process.env.FROM_EMAIL || 'noreply@edubrief.com',
      subject: formattedSubject,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject || 'N/A'}
        
        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    // Send email
    await sgMail.send(msg);

    // Send confirmation email to the user
    const confirmationMsg = {
      to: email,
      from: process.env.FROM_EMAIL || 'noreply@edubrief.com',
      subject: 'Thank you for contacting EduBrief',
      text: `
        Dear ${name},
        
        Thank you for reaching out to us at EduBrief. We've received your message and will get back to you as soon as possible.
        
        For your reference, here's a copy of your message:
        
        Subject: ${subject || 'N/A'}
        
        ${message}
        
        
        Best regards,
        The EduBrief Team
      `,
      html: `
        <h2>Thank you for contacting EduBrief</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us at EduBrief. We've received your message and will get back to you as soon as possible.</p>
        <p>For your reference, here's a copy of your message:</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,<br>The EduBrief Team</p>
      `,
    };

    await sgMail.send(confirmationMsg);

    // Return success response
    return NextResponse.json({ message: 'Message sent successfully' });
    
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
