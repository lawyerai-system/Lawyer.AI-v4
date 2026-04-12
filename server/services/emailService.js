require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const createTransporter = async () => {
  try {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      debug: true
    });

    // Verify the connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return transporter;
  } catch (error) {
    console.error('SMTP Configuration Error:', error);
    throw error; // Throw so caller knows the specific error
  }
};

// Send verification email
exports.sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = await createTransporter();

    // Frontend verification URL - using proper URL structure
    const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

    const mailOptions = {
      from: `"LawAI Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your LawAI Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3c72;">Welcome to LawAI!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with LawAI. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>Best regards,<br>The LawAI Team</p>
        </div>
      `
    };

    console.log('Attempting to send verification email to:', email);
    console.log('Verification URL:', verificationUrl);
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send welcome email after verification
exports.sendWelcomeEmail = async (email, name, role) => {
  try {
    const transporter = await createTransporter();

    const roleSpecificContent = {
      lawyer: 'As a lawyer, you have access to all features including blog posting and answering questions in the courtroom.',
      law_student: 'As a law student, you can access the blog, prompt bar, and participate in discussions.',
      civilian: 'You can now ask questions in the courtroom and use the prompt bar for legal assistance.'
    };

    const mailOptions = {
      from: `"LawAI Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to LawAI - Account Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3c72;">Welcome to LawAI!</h2>
          <p>Hello ${name},</p>
          <p>Your email has been successfully verified. Welcome to the LawAI community!</p>
          <p>${roleSpecificContent[role]}</p>
          <p>Get started by exploring our features:</p>
          <ul>
            <li>Prompt Bar - Get instant legal assistance</li>
            <li>Court Room - Ask legal questions</li>
            <li>Blog - Read legal insights</li>
          </ul>
          <p>Best regards,<br>The LawAI Team</p>
        </div>
      `
    };

    console.log('Attempting to send welcome email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
// Send password reset email
exports.sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = await createTransporter();

    // Reset URL - matches active dev port
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Lawyer.AI Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request – Lawyer.AI',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background-color: #6C5DD3; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Lawyer.AI</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #555; line-height: 1.6;">Hello ${name},</p>
            <p style="color: #555; line-height: 1.6;">We received a request to reset the password for your Lawyer.AI account. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #6C5DD3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p style="color: #777; font-size: 0.9rem;">This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 0.8rem; text-align: center;">&copy; 2026 Lawyer.AI. All rights reserved.</p>
          </div>
        </div>
      `
    };

    console.log('Sending password reset email to:', email);
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('FATAL ERROR: Nodemailer reset email failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    throw error;
  }
};
