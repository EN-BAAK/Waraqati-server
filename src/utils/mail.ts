import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_MESSAGE_HOST as string,
  port: parseInt(process.env.MAIL_MESSAGE_PORT!, 10),
  auth: {
    user: process.env.MAIL_MESSAGE_EMAIL as string,
    pass: process.env.MAIL_MESSAGE_PASS as string,
  },
});

export const sendResetEmail = async (email: string, code: string): Promise<void> => {
  const html = `
    <div style="font-family:sans-serif;line-height:1.5">
      <h2>Password Reset Request</h2>
      <p>Your reset code is:</p>
      <h3 style="color:#007bff">${code}</h3>
      <p>It will expire in 15 minutes.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Code",
    html,
  });
};
