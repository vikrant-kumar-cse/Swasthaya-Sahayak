import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // ===========================
  //   INTERNAL HELPER
  // ===========================
  async sendMail({ to, subject, html, otp }) {
    const mailOptions = {
      from: process.env.SMTP_FROM || "Medical App <noreply@medicalapp.com>",
      to,
      subject,
      html,
    };

    try {
      // Development mode → No real email
      if (process.env.NODE_ENV === "development" || !process.env.SMTP_USER) {
        console.log("📨 DEV MODE EMAIL");
        console.log(`To: ${to}`);
        if (otp) console.log(`OTP: ${otp}`);
        return { success: true, message: "Email logged to console (DEV MODE)" };
      }

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("❌ Email sending error:", error);

      // Always show OTP in console so user can proceed
      if (otp) console.log(`📧 OTP for ${to}: ${otp}`);

      return { success: false, message: "Email sending failed (OTP logged to console)" };
    }
  }

  // ===========================
  //   SEND SIGNUP OTP EMAIL
  // ===========================
  async sendSignupOTP(email, otp, userName) {
    return this.sendMail({
      to: email,
      subject: "Verify Your Email - Medical App",
      html: this.signupOTPTemplate(otp, userName),
      otp,
    });
  }

  signupOTPTemplate(otp, userName) {
    return `
      <html>
      <body style="font-family: Arial; color: #333;">
        <div style="max-width:600px; margin:auto; padding:20px;">
          <h2 style="text-align:center; background:#007bff; padding:15px; color:white;">
            Medical App - Email Verification
          </h2>
          <p>Hello <b>${userName}</b>,</p>
          <p>Use the OTP below to verify your email:</p>

          <h1 style="text-align:center; letter-spacing:8px; color:#007bff;">
            ${otp}
          </h1>

          <p>This OTP is valid for 10 minutes. Do not share it.</p>

          <p style="font-size:12px; color:#777; text-align:center; margin-top:30px;">
            © 2025 Medical App
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // ===========================
  //   SEND PASSWORD RESET OTP
  // ===========================
  async sendPasswordResetOTP(email, otp, userName) {
    return this.sendMail({
      to: email,
      subject: "Password Reset OTP - Medical App",
      html: this.resetOTPTemplate(otp, userName),
      otp,
    });
  }

  resetOTPTemplate(otp, userName) {
    return `
      <html>
      <body style="font-family: Arial; color:#333;">
        <div style="max-width:600px; margin:auto; padding:20px;">
          <h2 style="text-align:center; background:#dc3545; padding:15px; color:white;">
            Medical App - Password Reset
          </h2>

          <p>Hello <b>${userName}</b>,</p>
          <p>Use the OTP below to reset your password:</p>

          <h1 style="text-align:center; letter-spacing:8px; color:#dc3545;">
            ${otp}
          </h1>

          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, ignore this email.</p>

          <p style="font-size:12px; color:#777; text-align:center; margin-top:30px;">
            © 2025 Medical App
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // ===========================
  //   SEND WELCOME EMAIL
  // ===========================
  async sendWelcomeEmail(email, userName) {
    return this.sendMail({
      to: email,
      subject: "Welcome to Medical App 🎉",
      html: this.welcomeTemplate(userName),
    });
  }

  welcomeTemplate(userName) {
    return `
      <html>
      <body style="font-family: Arial; color:#333;">
        <div style="max-width:600px; margin:auto; padding:20px;">
          <h2 style="text-align:center; background:#28a745; padding:15px; color:white;">
            Welcome to Medical App!
          </h2>

          <p>Hello <b>${userName}</b>,</p>
          <p>Your email has been successfully verified. 🎉</p>
          <p>You can now use all features of the Medical App.</p>

          <p style="font-size:12px; color:#777; text-align:center; margin-top:30px;">
            © 2025 Medical App
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

const emailService = new EmailService();
export default emailService;
