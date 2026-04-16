import { backendApiBaseUrl } from "@/lib/api";
import { JnfFormValues } from "@/features/jnf/schemas";

export type BackendSubmission = {
  id?: number;
  jnf_id?: number;
  inf_id?: number;
  type?: "jnf" | "inf";
  title?: string | null;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
  company?: {
    company_name?: string | null;
  } | null;
  job_profile?: BackendProfile | null;
  internship_profile?: BackendProfile | null;
  jobProfile?: BackendProfile | null;
  internshipProfile?: BackendProfile | null;
  profile?: BackendProfile | null;
};

type BackendProfile = {
  job_designation?: string | null;
  internship_role?: string | null;
  profile_name?: string | null;
};

export type Proposal = {
  id: string;
  numericId?: number;
  type: "JNF" | "INF";
  title: string;
  status: string;
  dateLabel: string;
  date: string;
  action: string;
  href?: string;
};

type DashboardData = {
  totals?: Record<string, number>;
  jnfs_by_status?: Record<string, number>;
  infs_by_status?: Record<string, number>;
  recent_jnfs?: BackendSubmission[];
  recent_infs?: BackendSubmission[];
};

const jsonHeaders = (token: string) => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

const nullableNumber = (value: string | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== "" ? parsed : null;
};

const normalizeMode = (value: string | undefined) => {
  const normalized = value?.trim().toLowerCase();
  return normalized === "remote" || normalized === "hybrid" ? normalized : "onsite";
};

const normalizeSelectionMode = (value: string | undefined) => {
  const normalized = value?.trim().toLowerCase();
  return normalized === "offline" || normalized === "hybrid" ? normalized : "online";
};

const normalizeRoundType = (value: string | undefined) => {
  const normalized = value?.trim().toLowerCase();
  if (normalized?.includes("technical")) return "technical";
  if (normalized?.includes("hr")) return "hr";
  if (normalized?.includes("gd") || normalized?.includes("group")) return "gd";
  if (normalized?.includes("aptitude") || normalized?.includes("written")) return "aptitude";
  return "other";
};

const normalizeInterviewMode = (value: string | undefined) => {
  const normalized = value?.trim().toLowerCase();
  if (normalized?.includes("tele")) return "telephonic";
  if (normalized?.includes("video")) return "video";
  return "on-campus";
};

export function toJnfPayload(values: JnfFormValues) {
  return {
    title: values.jobProfile.jobTitle || values.jobProfile.designation || "Untitled JNF",
    description: values.jobProfile.jdContent || values.companyProfile.description || null,
    job_profile: {
      profile_name: values.jobProfile.jobTitle || null,
      job_designation: values.jobProfile.designation || values.jobProfile.jobTitle || null,
      place_of_posting: values.jobProfile.location || null,
      work_location_mode: normalizeMode(values.jobProfile.workMode),
      expected_hires: nullableNumber(values.jobProfile.expectedHires),
      minimum_hires: nullableNumber(values.jobProfile.minimumHires),
      tentative_joining_month: values.jobProfile.joiningDate || null,
      required_skills: values.jobProfile.skills,
      job_description: values.jobProfile.jdContent || null,
      jd_pdf_path: values.jobProfile.jdPdf || null,
      additional_info: values.jobProfile.additionalInfo || null,
      bond_details: [values.jobProfile.bondAmount, values.jobProfile.bondDuration, values.jobProfile.deductions]
        .filter(Boolean)
        .join(" | ") || null,
      registration_link: values.jobProfile.registrationLink.startsWith("http") ? values.jobProfile.registrationLink : null,
      onboarding_details: values.jobProfile.onboardingInfo || null
    }
  };
}

export function toCompanyPayload(values: JnfFormValues) {
  const [hqCity, hqCountry] = values.companyProfile.hqLocation.split(",").map((part) => part.trim());
  const category = values.companyProfile.orgType?.trim().toLowerCase();
  const allowedCategory = ["startup", "mnc", "psu", "private", "other"].includes(category) ? category : "other";

  return {
    company_name: values.companyProfile.companyName,
    website: values.companyProfile.website,
    postal_address: values.companyProfile.address,
    no_of_employees: nullableNumber(values.companyProfile.employees),
    sector: values.companyProfile.sector,
    company_logo: values.companyProfile.logoFile,
    category: allowedCategory,
    date_of_establishment: values.companyProfile.establishmentDate || null,
    annual_turnover: nullableNumber(values.companyProfile.annualTurnover),
    linkedin_url: values.companyProfile.linkedInUrl,
    industry_tags: values.companyProfile.industryTags,
    hq_city: hqCity || null,
    hq_country: hqCountry || null,
    company_description: values.companyProfile.description
  };
}

export function toDetailsPayload(values: JnfFormValues) {
  const eligibility = Object.values(values.eligibility.courses)
    .flat()
    .filter((row) => row.branchId && (row.selected || row.majorSelected || row.minorSelected))
    .map((row) => ({
      branch_id: row.branchId,
      min_cgpa: nullableNumber(row.cgpa),
      backlog_allowed: row.backlogsAllowed
    }));

  return {
    salaries: values.salary.salaryRows.map((row) => ({
      currency: values.salary.currency,
      ctc: nullableNumber(row.ctc),
      base_salary: nullableNumber(row.base),
      in_hand: nullableNumber(row.monthlyTakeHome),
      components: values.salary.sameForAll
        ? values.salary.sharedComponents
            .filter((component) => component.label && component.value)
            .map((component) => ({
              component_name: component.label,
              description: component.value
            }))
        : []
    })),
    eligibility,
    selection_process: {
      pre_placement_talk: values.selectionProcess.stages.some((stage) => /ppt|pre/i.test(stage.stage)),
      resume_shortlisting: values.selectionProcess.stages.some((stage) => /resume|shortlist/i.test(stage.stage)),
      written_test: values.selectionProcess.stages.some((stage) => /test|written|aptitude/i.test(stage.stage)),
      group_discussion: values.selectionProcess.stages.some((stage) => /group|gd/i.test(stage.stage)),
      interview: values.selectionProcess.stages.some((stage) => /interview|hr|technical/i.test(stage.stage)),
      selection_mode: normalizeSelectionMode(values.selectionProcess.stages[0]?.mode),
      psychometric_test: values.selectionProcess.psychometricTest,
      medical_test: values.selectionProcess.medicalTest,
      other_screening: values.selectionProcess.otherScreening || null,
      infrastructure_details: values.selectionProcess.infrastructureNeeds || null,
      rounds: values.selectionProcess.stages.map((stage, index) => ({
        round_type: normalizeRoundType(stage.testType || stage.stage),
        mode: normalizeSelectionMode(stage.mode),
        duration_minutes: nullableNumber(stage.duration),
        interview_mode: normalizeInterviewMode(stage.interviewMode),
        round_order: index + 1
      }))
    }
  };
}

export async function saveJnfToBackend(values: JnfFormValues, token: string, existingId?: number | null) {
  await fetch(`${backendApiBaseUrl}/company/profile`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(toCompanyPayload(values))
  });

  const endpoint = existingId ? `${backendApiBaseUrl}/jnfs/${existingId}/autosave` : `${backendApiBaseUrl}/jnfs/autosave`;
  const response = await fetch(endpoint, {
    method: existingId ? "PATCH" : "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(toJnfPayload(values))
  });

  if (!response.ok) {
    throw new Error("Unable to save JNF.");
  }

  const payload = await response.json();
  const jnfId = Number(payload.data?.jnf_id);

  await fetch(`${backendApiBaseUrl}/jnfs/${jnfId}/details`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(toDetailsPayload(values))
  });

  return jnfId;
}

export async function submitJnfToBackend(values: JnfFormValues, token: string, existingId?: number | null) {
  const jnfId = await saveJnfToBackend(values, token, existingId);
  const response = await fetch(`${backendApiBaseUrl}/jnfs/${jnfId}/submit`, {
    method: "POST",
    headers: jsonHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Unable to submit JNF.");
  }

  return jnfId;
}

export function submissionToProposal(submission: BackendSubmission, type: "JNF" | "INF"): Proposal {
  const numericId = Number(type === "JNF" ? submission.jnf_id ?? submission.id : submission.inf_id ?? submission.id);
  const profile = submission.profile ?? submission.job_profile ?? submission.internship_profile ?? submission.jobProfile ?? submission.internshipProfile;
  const title =
    submission.title ??
    profile?.job_designation ??
    profile?.internship_role ??
    profile?.profile_name ??
    `Untitled ${type}`;
  const status = formatStatus(submission.status);

  return {
    id: `${type}-${numericId || "NEW"}`,
    numericId,
    type,
    title,
    status,
    dateLabel: status === "Accepted" ? "Submitted on" : "Last updated",
    date: formatDateLabel(submission.created_at),
    action: status === "Open for Edit" || status === "Draft" ? "Continue" : "View",
    href: type === "JNF" && (status === "Open for Edit" || status === "Draft")
      ? "/jnf/new?loadDraft=1"
      : type === "INF" && (status === "Open for Edit" || status === "Draft")
      ? "/inf/new?loadDraft=1"
      : type === "JNF"
      ? "/jnf/preview?mode=review"
      : "/inf/preview?mode=review"
  };
}

export function dashboardToProposals(data: DashboardData): Proposal[] {
  return [
    ...(data.recent_jnfs ?? []).map((item) => submissionToProposal(item, "JNF")),
    ...(data.recent_infs ?? []).map((item) => submissionToProposal(item, "INF"))
  ];
}

export async function fetchCompanyDashboard(token: string): Promise<DashboardData> {
  const response = await fetch(`${backendApiBaseUrl}/company/dashboard`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return {};
  }

  const payload = await response.json();
  return payload.data ?? {};
}

export async function fetchCompanySubmissions(token: string, type: "jnf" | "inf"): Promise<Proposal[]> {
  const response = await fetch(`${backendApiBaseUrl}/${type}s`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  return (payload.data ?? []).map((item: BackendSubmission) => submissionToProposal(item, type.toUpperCase() as "JNF" | "INF"));
}

export function formatStatus(status?: string | null) {
  switch (status) {
    case "approved":
      return "Accepted";
    case "submitted":
      return "Under Review";
    case "open_edit":
      return "Open for Edit";
    case "rejected":
      return "Rejected";
    case "draft":
      return "Draft";
    default:
      return "Draft";
  }
}

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
