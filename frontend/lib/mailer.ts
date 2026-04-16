import nodemailer from "nodemailer";

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();

  if (!host || !user || !pass || !from || Number.isNaN(port)) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    user,
    pass,
    from
  };
}

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter() {
  if (!transporterPromise) {
    const config = getMailConfig();
    if (!config) {
      throw new Error("SMTP is not configured.");
    }

    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass
        }
      })
    );
  }

  return transporterPromise;
}

export function isMailConfigured() {
  return Boolean(getMailConfig());
}

export async function sendOtpEmail(recipient: string, otp: string, expiresInMinutes: number) {
  const config = getMailConfig();
  if (!config) {
    throw new Error("SMTP is not configured.");
  }

  const transporter = await getTransporter();
  await transporter.sendMail({
    from: config.from,
    to: recipient,
    subject: "Recruiter registration OTP",
    text: `Your recruiter registration OTP is ${otp}. It will expire in ${expiresInMinutes} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1c1c1c;">
        <h2 style="margin-bottom: 8px;">Recruiter registration verification</h2>
        <p style="margin: 0 0 16px;">Use the OTP below to complete your registration.</p>
        <div style="display: inline-block; padding: 12px 18px; font-size: 28px; font-weight: 700; letter-spacing: 6px; background: #f4f9f0; border: 1px solid #cfe0c2; border-radius: 10px;">
          ${otp}
        </div>
        <p style="margin: 16px 0 0;">This OTP will expire in ${expiresInMinutes} minutes.</p>
      </div>
    `
  });
}

