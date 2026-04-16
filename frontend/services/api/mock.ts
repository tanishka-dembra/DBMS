import { delay } from "@/utils/delay";
import { RegistrationFormValues } from "@/features/auth/schemas";
import { JnfFormValues } from "@/features/jnf/schemas";

export async function mockSendOtp(email: string) {
  await delay(900);
  return {
    email,
    otp: "123456",
    expiresIn: 300
  };
}

export async function mockRegisterRecruiter(payload: RegistrationFormValues) {
  await delay(1200);
  return {
    success: true,
    recruiterId: `rec-${Date.now()}`,
    payload
  };
}

export async function mockSaveJnf(payload: JnfFormValues) {
  await delay(700);
  return {
    success: true,
    savedAt: new Date().toISOString(),
    payload
  };
}

export async function mockSubmitJnf(payload: JnfFormValues) {
  await delay(1200);
  return {
    success: true,
    referenceId: `JNF-${Date.now()}`,
    payload
  };
}

export async function mockSaveInf(payload: JnfFormValues) {
  await delay(700);
  return {
    success: true,
    savedAt: new Date().toISOString(),
    payload
  };
}

export async function mockSubmitInf(payload: JnfFormValues) {
  await delay(1200);
  return {
    success: true,
    referenceId: `INF-${Date.now()}`,
    payload
  };
}
