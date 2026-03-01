// Brand colors
const BRAND_COLORS = {
    primary: '#09B850',
    primaryDark: '#07A046',
    primaryLight: '#E8F5E9',
    secondary: '#64748B',
    accent: '#F59E0B',
    danger: '#EF4444',
    success: '#10B981',
};

// Helper to wrap content in base template
const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: ${BRAND_COLORS.primary}; padding: 30px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
        .content { padding: 30px; }
        .button { display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0; }
        .button:hover { background: ${BRAND_COLORS.primaryDark}; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .warning-box { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffeaa7; }
        .url-box { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Partcer</h1>
            <p>${title}</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Partcer. All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 12px;">If you need assistance, contact us at admin@partcer.com</p>
        </div>
    </div>
</body>
</html>
`;

// ==================== USER EMAILS ====================

// 1. Welcome Email with Verification
export const welcomeEmail = async (transporter, user, verificationToken) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const html = baseTemplate(`
        <h2>Welcome to Partcer, ${user.firstName}! 🎉</h2>
        <p>Your account has been successfully created. Please verify your email address to get started.</p>
        
        <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link:</p>
        <div class="url-box">${verificationUrl}</div>
        
        <div class="info-box">
            <p><strong>Account Details:</strong></p>
            <p>Name: ${user.firstName} ${user.lastName}</p>
            <p>Email: ${user.email}</p>
            <p>Account Type: ${user.userType}</p>
        </div>
        
        <div class="warning-box">
            <p><strong>⚠️ This verification link will expire in 24 hours.</strong></p>
        </div>
    `, 'Verify Your Email');

    try {
        const info = await transporter.sendMail({
            from: `"Partcer" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `🎉 Welcome to Partcer, ${user.firstName}! Please verify your email`,
            html
        });
        return !!info;
    } catch (error) {
        throw new Error(`Failed to send welcome email: ${error.message}`);
    }
};

// 2. New User Registration Notification for Admin
export const newUserRegistrationEmailForAdmin = async (transporter, adminEmail, user) => {
    const html = baseTemplate(`
        <h2>👤 New User Registration</h2>
        <p>A new user has joined Partcer.</p>
        
        <div class="info-box">
            <p><strong>User Details:</strong></p>
            <p>Name: ${user.firstName} ${user.lastName}</p>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone || 'Not provided'}</p>
            <p>User Type: ${user.userType}</p>
            <p>Country: ${user.country || 'Not specified'}</p>
            <p>Joined: ${new Date(user.createdAt).toLocaleString()}</p>
            <p>Status: ${user.isVerified ? '✅ Verified' : '⚠️ Pending Verification'}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.ADMIN_URL}/users/${user._id}" class="button">View User Profile</a>
        </div>
    `, 'New User Registration');

    try {
        const info = await transporter.sendMail({
            from: `"Partcer" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `🚀 New ${user.userType} joined Partcer - ${user.firstName} ${user.lastName}`,
            html
        });
        return !!info;
    } catch (error) {
        throw new Error(`Failed to send admin notification: ${error.message}`);
    }
};

// 3. Email Verification Success
export const emailVerifiedSuccessEmail = async (transporter, user) => {
    const html = baseTemplate(`
        <h2>Email Verified Successfully! ✅</h2>
        <p>Your email has been verified, ${user.firstName}. Thank you!</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="width: 60px; height: 60px; background: ${BRAND_COLORS.success}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 30px;">✓</span>
            </div>
            <p>You now have full access to all Partcer features.</p>
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
        </div>
    `, 'Email Verified');

    try {
        const info = await transporter.sendMail({
            from: `"Partcer" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `✅ Email Verified - Welcome to Partcer, ${user.firstName}!`,
            html
        });
        return !!info;
    } catch (error) {
        throw new Error(`Failed to send verification success email: ${error.message}`);
    }
};

// 4. Password Reset Email
export const passwordResetEmail = async (transporter, user, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const html = baseTemplate(`
        <h2>Reset Your Password 🔒</h2>
        <p>Hello ${user.firstName},</p>
        <p>We received a request to reset your Partcer password.</p>
        
        <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link:</p>
        <div class="url-box">${resetUrl}</div>
        
        <div class="warning-box">
            <p><strong>⚠️ This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `, 'Reset Password');

    try {
        const info = await transporter.sendMail({
            from: `"Partcer" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `🔐 Reset Your Partcer Password`,
            html
        });
        return !!info;
    } catch (error) {
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
};

// 5. Password Changed Successfully
export const passwordChangedEmail = async (transporter, user) => {
    const html = baseTemplate(`
        <h2>Password Changed Successfully 🔐</h2>
        <p>Your Partcer account password was successfully changed on ${new Date().toLocaleString()}.</p>
        
        <div class="warning-box">
            <p><strong>🔒 Didn't make this change?</strong></p>
            <p>If you didn't change your password, please contact support immediately.</p>
        </div>
    `, 'Password Changed');

    try {
        const info = await transporter.sendMail({
            from: `"Partcer" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `🔒 Your Partcer Password Has Been Changed`,
            html
        });
        return !!info;
    } catch (error) {
        throw new Error(`Failed to send password changed email: ${error.message}`);
    }
};