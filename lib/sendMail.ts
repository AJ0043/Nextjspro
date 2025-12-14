import nodemailer from "nodemailer";

// ---------------------------------------------
// 🔹 Create transporter
// ---------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,   // smtp.gmail.com
  port: 465,                            // SSL port
  secure: true,                         // port 465 ke liye true
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  tls: { rejectUnauthorized: false },   // local dev SSL issues avoid karne ke liye
});

// ---------------------------------------------
// 🔹 Generate OTP
// ---------------------------------------------
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------------------------------
// ✉️ Send OTP Email
// ---------------------------------------------
export async function sendOTP(receiver: string, name: string) {
  try {
    const otp = generateOTP();

    const htmlContent = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 25px;
        background: #f7f7f9;
      ">
        <div style="text-align:center; margin-bottom:20px;">
          <img 
            src="${process.env.NEXT_PUBLIC_BASE_URL}/estore.webp"
            alt="Stech Web"
            width="140"
            style="display:block; margin:auto;"
          />
        </div>

        <h2 style="text-align:center; color:#333; margin-bottom:10px;">
          Email Verification Required
        </h2>

        <p style="color:#555; font-size:16px; line-height:1.6; text-align:center;">
          Hello <b>${name}</b>,<br/>
          Please verify your email to continue.
        </p>

        <div style="
          text-align:center;
          margin: 25px 0;
          font-size: 40px;
          font-weight: bold;
          letter-spacing: 10px;
          color: #6b46c1;
        ">
          ${otp}
        </div>

        <p style="text-align:center; color:#777;">
          This OTP is valid for <b>10 minutes</b>.
        </p>

        <div style="text-align:center; margin-top:20px;">
          <a 
            href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-otp?email=${receiver}" 
            style="
              background:#6b46c1;
              color:white;
              padding:12px 28px;
              border-radius: 8px;
              text-decoration:none;
              font-size:16px;
              font-weight:bold;
            "
          >
            Verify Your Email
          </a>
        </div>

        <hr style="border:none; border-top:1px solid #ddd; margin:30px 0;" />

        <p style="text-align:center; font-size:14px; color:#666;">
          If you did not request this email, please ignore it.
        </p>

        <p style="text-align:center; margin-top:10px; font-size:12px; color:#aaa;">
          © ${new Date().getFullYear()} Stech Web. All rights reserved.
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Stech Web" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject: "Your Stech Web OTP Code",
      html: htmlContent,
    });

    console.log(`✅ OTP sent to ${receiver}: ${otp}`);
    return otp;

  } catch (error: any) {
    console.error("❌ Email Send Error:", error.message || error);
    throw new Error("Email sending failed");
  }
}
