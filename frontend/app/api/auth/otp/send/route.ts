import { NextResponse } from "next/server";
import { isMailConfigured, sendOtpEmail } from "@/lib/mailer";
import { issueOtp } from "@/lib/otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim();

  if (!email) {
    return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
  }

  const { otp, ttlSeconds } = issueOtp(email, 300);
  const expiresInMinutes = Math.ceil(ttlSeconds / 60);

  if (!isMailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message: "Email delivery is not configured. Add SMTP settings to enable OTP emails."
      },
      { status: 500 }
    );
  }

  try {
    await sendOtpEmail(email, otp, expiresInMinutes);
  } catch (error) {
    console.error("Failed to send OTP email", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Unable to send OTP email right now. Please try again."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    expiresIn: ttlSeconds
  });
}
