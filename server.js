const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Blue Frame Digital <contact@${process.env.RESEND_DOMAIN || 'blueframe.digital'}>`,
      to: [process.env.CONTACT_EMAIL || 'isaac@blueframe.digital'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066FF;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the contact form on blueframe.digital
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}
      `.trim()
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ 
        error: 'Failed to send email. Please try again later.' 
      });
    }

    console.log('Email sent successfully:', data);

    // Send confirmation email to the user
    await resend.emails.send({
      from: `Blue Frame Digital <contact@${process.env.RESEND_DOMAIN || 'blueframe.digital'}>`,
      to: [email],
      subject: 'Thank you for contacting Blue Frame Digital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066FF;">Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>In the meantime, feel free to explore our services and learn more about how we can help grow your construction business.</p>
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Blue Frame Digital</strong>
          </p>
        </div>
      `,
      text: `
Thank you for reaching out!

Hi ${name},

We've received your message and will get back to you as soon as possible.

In the meantime, feel free to explore our services and learn more about how we can help grow your construction business.

Best regards,
Blue Frame Digital
      `.trim()
    });

    res.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

