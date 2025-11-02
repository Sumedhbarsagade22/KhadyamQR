import { Router, type Request, type Response } from 'express';
import { sendEmail } from '../lib/email';
import { z } from 'zod';

const router = Router();

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Please enter a valid mobile number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = contactSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }

    const { name, email, mobile, subject, message } = validation.data;
    
    // Send email to admin from the sender's email
    await sendEmail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || '',
      subject: `[Contact Form] ${subject}`,
      text: `
        New contact form submission:
        
        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p>You have received a new message from the contact form:</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Subject:</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; white-space: pre-line;">${message}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
            <p>This email was sent from the KhadyamQR contact form.</p>
            <p>You can reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      replyTo: `${name} <${email}>`
    });
    
    // Send confirmation email to the user
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting KhadyamQR',
      text: `
        Dear ${name},
        
        Thank you for reaching out to us. We have received your message and will get back to you within 24-48 hours.
        
        Here's a copy of your message:
        
        Subject: ${subject}
        Message: ${message}
        
        Best regards,
        The KhadyamQR Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for contacting KhadyamQR!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and our team will get back to you within 24-48 hours.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 12px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Your Message:</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 5px 0; white-space: pre-line;"><strong>Message:</strong><br>${message}</p>
          </div>
          
          <p>If you have any further questions, feel free to reply to this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} KhadyamQR. All rights reserved.</p>
          </div>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (err) {
    console.error('Error processing contact form:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

export default router;
