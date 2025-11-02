import nodemailer from 'nodemailer';

// Create a transporter object using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development with self-signed certificates
  }
});

// Verify SMTP connection
// Verify SMTP connection but make it non-fatal in dev/test when credentials may be invalid.
(async () => {
  try {
    // Only attempt SMTP verification in production to avoid blocking local dev/test when credentials are invalid
    if (process.env.NODE_ENV !== 'production') return;
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;

    // transporter.verify returns a promise when callback is omitted
    await transporter.verify();
  } catch (err) {
    // Log the error but do not allow startup to fail because of SMTP issues
    console.error('SMTP connection error (non-fatal):', err);
  }
})();

export interface SendEmailOptions {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const mailOptions = {
      from: options.from || `"KhadyamQR" <${process.env.SMTP_USER}>`,
      to: options.to,
      replyTo: options.replyTo || options.from || process.env.SMTP_USER,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    };

    const info = await transporter.sendMail(mailOptions);
  // Message sent
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
