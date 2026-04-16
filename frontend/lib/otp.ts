type StoredOtp = {
  otp: string;
  expiresAt: number;
};

type OtpStore = Map<string, StoredOtp>;

function getStore(): OtpStore {
  const globalRef = globalThis as typeof globalThis & { __jnfOtpStore?: OtpStore };
  if (!globalRef.__jnfOtpStore) {
    globalRef.__jnfOtpStore = new Map<string, StoredOtp>();
  }
  return globalRef.__jnfOtpStore;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateOtp(): string {
  const demoOtp = process.env.DEMO_OTP;
  if (demoOtp && /^\d{6}$/.test(demoOtp)) {
    return demoOtp;
  }

  return String(Math.floor(100000 + Math.random() * 900000));
}

export function issueOtp(email: string, ttlSeconds = 300) {
  const normalized = normalizeEmail(email);
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  getStore().set(normalized, { otp, expiresAt });
  return { email: normalized, otp, expiresAt, ttlSeconds };
}

export function verifyOtp(email: string, otp: string) {
  const normalized = normalizeEmail(email);
  const stored = getStore().get(normalized);
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    getStore().delete(normalized);
    return false;
  }

  const ok = stored.otp === otp.trim();
  if (ok) {
    getStore().delete(normalized);
  }
  return ok;
}
