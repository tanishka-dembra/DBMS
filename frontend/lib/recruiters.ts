import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashPassword, verifyPassword } from "@/lib/password";

export type RecruiterRecord = {
  id: string;
  email: string;
  recruiterName: string;
  designation: string;
  contactNumber: string;
  alternateNumber?: string;
  passwordHash: string;
  createdAt: string;
};

type RecruiterInput = {
  email: string;
  recruiterName: string;
  designation: string;
  contactNumber: string;
  alternateNumber?: string;
  password: string;
};

const recruitersFilePath = path.join(process.cwd(), "data", "recruiters.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureRecruiterFile() {
  await mkdir(path.dirname(recruitersFilePath), { recursive: true });
  try {
    await readFile(recruitersFilePath, "utf8");
  } catch {
    await writeFile(recruitersFilePath, "[]", "utf8");
  }
}

export async function getRecruiters() {
  await ensureRecruiterFile();
  const file = await readFile(recruitersFilePath, "utf8");
  return JSON.parse(file) as RecruiterRecord[];
}

async function saveRecruiters(recruiters: RecruiterRecord[]) {
  await ensureRecruiterFile();
  await writeFile(recruitersFilePath, JSON.stringify(recruiters, null, 2), "utf8");
}

export async function findRecruiterByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const recruiters = await getRecruiters();
  return recruiters.find((recruiter) => recruiter.email === normalizedEmail) ?? null;
}

export async function createRecruiter(input: RecruiterInput) {
  const normalizedEmail = normalizeEmail(input.email);
  const recruiters = await getRecruiters();

  if (recruiters.some((recruiter) => recruiter.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const recruiter: RecruiterRecord = {
    id: `rec-${Date.now()}`,
    email: normalizedEmail,
    recruiterName: input.recruiterName.trim(),
    designation: input.designation.trim(),
    contactNumber: input.contactNumber.trim(),
    alternateNumber: input.alternateNumber?.trim() || "",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString()
  };

  recruiters.push(recruiter);
  await saveRecruiters(recruiters);

  return recruiter;
}

export async function validateRecruiterCredentials(email: string, password: string) {
  const recruiter = await findRecruiterByEmail(email);
  if (!recruiter) {
    return null;
  }

  return verifyPassword(password, recruiter.passwordHash) ? recruiter : null;
}

