import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.MAIL_MESSAGE_HOST as string,
  port: parseInt(process.env.MAIL_MESSAGE_PORT!, 10),
  auth: {
    user: process.env.MAIL_MESSAGE_EMAIL as string,
    pass: process.env.MAIL_MESSAGE_PASS as string,
  },
});

export const sendResetEmail = async (email: string, code: string): Promise<void> => {
  const html = `
    <div style="background-color:#f9fafb;padding:40px 0;font-family:Arial,sans-serif">
      <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden">
        <!-- Header -->
        <div style="background:#2563eb;color:#ffffff;padding:20px;text-align:center">
          <h1 style="margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px">
            Waraqati
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:30px;text-align:center;color:#374151">
          <h2 style="margin-top:0;margin-bottom:16px;font-size:20px;color:#111827">
            Password Reset Request
          </h2>
          <p style="margin-bottom:20px;font-size:15px;line-height:1.6">
            We received a request to reset your password. Use the code below to continue:
          </p>

          <!-- Reset Code -->
          <div style="display:inline-block;background:#2563eb;color:#ffffff;
            font-size:20px;font-weight:bold;letter-spacing:4px;
            padding:12px 24px;border-radius:8px;margin-bottom:20px">
            ${code}
          </div>

          <p style="margin:0;font-size:14px;color:#6b7280">
            This code will expire in <strong>15 minutes</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:16px;text-align:center;font-size:13px;color:#9ca3af">
          If you didn’t request this, you can safely ignore this email.
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `Waraqati <Support>`,
    to: email,
    subject: "Password Reset Code",
    html,
  });
};
