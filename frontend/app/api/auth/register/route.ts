import { NextResponse } from "next/server";
import { registrationSchema } from "@/features/auth/schemas";
import { createRecruiter } from "@/lib/recruiters";
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
    const recruiter = await createRecruiter({
      email: values.email,
      recruiterName: values.recruiterName,
      designation: values.designation,
      contactNumber: values.contactNumber,
      alternateNumber: values.alternateNumber,
      password: values.password
    });

    return NextResponse.json({
      ok: true,
      recruiter: {
        id: recruiter.id,
        email: recruiter.email,
        recruiterName: recruiter.recruiterName
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create recruiter account.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

