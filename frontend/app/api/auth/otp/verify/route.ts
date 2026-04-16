import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; otp?: string } | null;
  const email = body?.email?.trim();
  const otp = body?.otp?.trim();

  if (!email || !otp) {
    return NextResponse.json({ ok: false, valid: false, message: "Email and OTP are required" }, { status: 400 });
  }

  const valid = verifyOtp(email, otp);
  return NextResponse.json({ ok: true, valid });
}

