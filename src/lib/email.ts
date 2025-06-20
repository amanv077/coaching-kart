import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, name: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Verify Your Account - ${process.env.APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ${process.env.APP_NAME}!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Thank you for joining ${process.env.APP_NAME}! To complete your registration and secure your account, please verify your email address using the OTP below:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="font-size: 14px; color: #666; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <h1 style="font-size: 36px; color: #667eea; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
            </div>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>⏰ Important:</strong> This OTP will expire in <strong>10 minutes</strong> for security reasons.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you didn't create an account with ${process.env.APP_NAME}, please ignore this email or contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent by ${process.env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

// Send demo booking confirmation email
export async function sendDemoBookingEmail(
  email: string, 
  userName: string, 
  sessionDetails: {
    sessionTitle: string;
    courseName: string;
    organizationName: string;
    dateTime: Date;
    duration: number;
    mode: string;
    location?: string | null;
    meetingLink?: string | null;
    contactNumber?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
  }
): Promise<boolean> {
  try {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      }).format(date);
    };

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Demo Session Confirmed - ${sessionDetails.organizationName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Demo Session Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Demo Session Confirmed! 🎉</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hi ${userName}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Great news! Your demo session has been confirmed. Here are your session details:
            </p>
            
            <div style="background: white; border-radius: 10px; padding: 30px; margin: 30px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #4CAF50; margin-top: 0; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                📚 ${sessionDetails.sessionTitle}
              </h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">🏢 Coaching:</span>
                  <span>${sessionDetails.organizationName}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">📖 Course:</span>
                  <span>${sessionDetails.courseName}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">📅 Date & Time:</span>
                  <span style="color: #4CAF50; font-weight: bold;">${formatDate(sessionDetails.dateTime)}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">⏱️ Duration:</span>
                  <span>${sessionDetails.duration} minutes</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">💻 Mode:</span>
                  <span style="text-transform: capitalize;">${sessionDetails.mode}</span>
                </div>
                
                ${sessionDetails.location ? `
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">📍 Location:</span>
                  <span>${sessionDetails.location}</span>
                </div>
                ` : ''}
                
                ${sessionDetails.meetingLink ? `
                <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold; width: 120px; color: #666;">🔗 Meeting Link:</span>
                  <a href="${sessionDetails.meetingLink}" style="color: #4CAF50; text-decoration: none;">${sessionDetails.meetingLink}</a>
                </div>
                ` : ''}
                
                ${sessionDetails.contactNumber ? `
                <div style="display: flex; align-items: center; padding: 10px 0;">
                  <span style="font-weight: bold; width: 120px; color: #666;">📞 Contact:</span>
                  <span>${sessionDetails.contactNumber}</span>
                </div>
                ` : ''}
              </div>
            </div>
            
            ${sessionDetails.address ? `
            <div style="background: #e8f5e8; border-left: 4px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: #2e7d32;">📍 Address:</h4>
              <p style="margin: 0; font-size: 14px;">
                ${sessionDetails.address}<br>
                ${sessionDetails.city ? `${sessionDetails.city}, ` : ''}${sessionDetails.state || ''}
              </p>
            </div>
            ` : ''}
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>⚠️ Important:</strong> Please arrive 10 minutes early and bring a notebook and pen. If you need to reschedule or cancel, please contact the coaching center directly.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; color: #666;">
                We're excited to have you join this demo session! 🚀
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent by ${process.env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Demo booking confirmation email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending demo booking confirmation email:', error);
    return false;
  }
}

// Verify transporter configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email transporter is ready');
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
}
