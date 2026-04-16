import { NextResponse } from "next/server";
import { registrationSchema } from "@/features/auth/schemas";
import { backendApiBaseUrl } from "@/lib/api";
import { verifyOtp } from "@/lib/otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please enter valid registration details." }, { status: 400 });
  }

  const values = parsed.data;
  const otpValid = verifyOtp(values.email, values.otp);
  if (!otpValid) {
    return NextResponse.json({ ok: false, message: "Invalid or expired OTP. Please request a new OTP." }, { status: 400 });
  }

  try {
    const domain = values.email.split("@")[1]?.split(".")[0] ?? "Company";
    const companyName = domain
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
      .join(" ");

    const response = await fetch(`${backendApiBaseUrl}/auth/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: values.recruiterName,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
        company_name: companyName || values.email,
        website: null
      })
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: payload?.message ?? "Unable to create recruiter account." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      recruiter: payload?.user,
      company: payload?.company
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create recruiter account.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
