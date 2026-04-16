import { backendApiBaseUrl } from "@/lib/api";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
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
    website?: string | null;
    postal_address?: string | null;
    no_of_employees?: number | null;
    sector?: string | null;
    company_logo?: string | null;
    category?: string | null;
    date_of_establishment?: string | null;
    annual_turnover?: number | string | null;
    linkedin_url?: string | null;
    industry_tags?: string[] | null;
    hq_city?: string | null;
    hq_country?: string | null;
    company_description?: string | null;
  } | null;
  job_profile?: BackendProfile | null;
  internship_profile?: BackendProfile | null;
  jobProfile?: BackendProfile | null;
  internshipProfile?: BackendProfile | null;
  profile?: BackendProfile | null;
  details?: BackendDetails | null;
  course_groups?: BackendCourseGroup[];
};

type BackendProfile = {
  job_designation?: string | null;
  internship_role?: string | null;
  profile_name?: string | null;
  place_of_posting?: string | null;
  work_location_mode?: string | null;
  expected_hires?: number | null;
  minimum_hires?: number | null;
  tentative_joining_month?: string | null;
  internship_start_month?: string | null;
  duration_months?: number | null;
  required_skills?: string[] | null;
  job_description?: string | null;
  jd_pdf_path?: string | null;
  additional_info?: string | null;
  bond_details?: string | null;
  onboarding_details?: string | null;
  registration_link?: string | null;
  ppo_available?: boolean | null;
};

type BackendDetails = {
  salaries?: Array<{
    currency?: string | null;
    ctc?: number | string | null;
    base_salary?: number | string | null;
    in_hand?: number | string | null;
    stipend?: number | string | null;
  }>;
  eligibility?: Array<{
    branch_id?: number | null;
    min_cgpa?: number | string | null;
    backlog_allowed?: boolean | number | null;
  }>;
  selection_process?: {
    psychometric_test?: boolean | number | null;
    medical_test?: boolean | number | null;
    other_screening?: string | null;
    infrastructure_details?: string | null;
    rounds?: Array<{
      round_type?: string | null;
      mode?: string | null;
      duration_minutes?: number | string | null;
      interview_mode?: string | null;
      round_order?: number | null;
    }>;
  } | null;
};

type BackendCourseGroup = {
  course_id: number;
  course_name: string;
  branches: Array<{
    branch_id: number;
    branch_name: string;
    department_name?: string | null;
  }>;
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

export type NotificationItem = {
  notification_id: number;
  title: string;
  message?: string | null;
  type?: "info" | "success" | "warning" | "error";
  related_entity?: "company" | "jnf" | "inf" | "approval" | "email" | null;
  related_id?: number | null;
  is_read: boolean;
  created_at?: string | null;
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

export function toInfPayload(values: JnfFormValues) {
  return {
    title: values.jobProfile.jobTitle || values.jobProfile.designation || "Untitled INF",
    description: values.jobProfile.jdContent || values.companyProfile.description || null,
    internship_profile: {
      profile_name: values.jobProfile.jobTitle || null,
      internship_role: values.jobProfile.designation || values.jobProfile.jobTitle || null,
      place_of_posting: values.jobProfile.location || null,
      work_location_mode: normalizeMode(values.jobProfile.workMode),
      expected_hires: nullableNumber(values.jobProfile.expectedHires),
      minimum_hires: nullableNumber(values.jobProfile.minimumHires),
      duration_months: nullableNumber(values.jobProfile.durationMonths),
      internship_start_month: values.jobProfile.joiningDate || null,
      required_skills: values.jobProfile.skills,
      job_description: values.jobProfile.jdContent || null,
      jd_pdf_path: values.jobProfile.jdPdf || null,
      additional_info: values.jobProfile.additionalInfo || null,
      ppo_available: values.jobProfile.ppoAvailable,
      registration_link: values.jobProfile.registrationLink.startsWith("http") ? values.jobProfile.registrationLink : null
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

  await throwApiError(response, "Unable to save JNF.");

  const payload = await response.json();
  const jnfId = Number(payload.data?.jnf_id);

  const detailsResponse = await fetch(`${backendApiBaseUrl}/jnfs/${jnfId}/details`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(toDetailsPayload(values))
  });
  await throwApiError(detailsResponse, "Unable to save JNF details.");

  return jnfId;
}

export async function submitJnfToBackend(values: JnfFormValues, token: string, existingId?: number | null) {
  const jnfId = await saveJnfToBackend(values, token, existingId);
  const response = await fetch(`${backendApiBaseUrl}/jnfs/${jnfId}/submit`, {
    method: "POST",
    headers: jsonHeaders(token)
  });

  await throwApiError(response, "Unable to submit JNF.");

  return jnfId;
}

export async function saveInfToBackend(values: JnfFormValues, token: string, existingId?: number | null) {
  await fetch(`${backendApiBaseUrl}/company/profile`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(toCompanyPayload(values))
  });

  const endpoint = existingId ? `${backendApiBaseUrl}/infs/${existingId}/autosave` : `${backendApiBaseUrl}/infs/autosave`;
  const response = await fetch(endpoint, {
    method: existingId ? "PATCH" : "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(toInfPayload(values))
  });

  await throwApiError(response, "Unable to save INF.");

  const payload = await response.json();
  const infId = Number(payload.data?.inf_id);

  const detailsResponse = await fetch(`${backendApiBaseUrl}/infs/${infId}/details`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(toDetailsPayload(values))
  });
  await throwApiError(detailsResponse, "Unable to save INF details.");

  return infId;
}

export async function submitInfToBackend(values: JnfFormValues, token: string, existingId?: number | null) {
  const infId = await saveInfToBackend(values, token, existingId);
  const response = await fetch(`${backendApiBaseUrl}/infs/${infId}/submit`, {
    method: "POST",
    headers: jsonHeaders(token)
  });

  await throwApiError(response, "Unable to submit INF.");

  return infId;
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
      ? `/jnf/new?loadDraft=1&id=${numericId}`
      : type === "INF" && (status === "Open for Edit" || status === "Draft")
      ? `/inf/new?loadDraft=1&id=${numericId}`
      : type === "JNF"
      ? `/jnf/preview?mode=review&id=${numericId}`
      : `/inf/preview?mode=review&id=${numericId}`
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

export async function fetchSubmission(token: string, type: "jnf" | "inf", id: number): Promise<BackendSubmission | null> {
  const [response, detailsResponse, coursesResponse] = await Promise.all([
    fetch(`${backendApiBaseUrl}/${type}s/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    }).catch(() => null),
    fetch(`${backendApiBaseUrl}/${type}s/${id}/details`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    }).catch(() => null),
    fetch(`${backendApiBaseUrl}/courses`, {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    }).catch(() => null)
  ]);

  if (!response?.ok) {
    return null;
  }

  const payload = await response.json();
  const detailsPayload = detailsResponse?.ok ? await detailsResponse.json() : { data: null };
  const courseGroups = coursesResponse?.ok ? await coursesResponse.json() : [];

  return {
    ...(payload.data ?? {}),
    details: detailsPayload.data ?? null,
    course_groups: Array.isArray(courseGroups) ? courseGroups : []
  };
}

export async function fetchSubmissionSummary(token: string, type: "jnf" | "inf", id: number): Promise<BackendSubmission | null> {
  const response = await fetch(`${backendApiBaseUrl}/${type}s/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.data ?? null;
}

export function submissionToFormValues(submission: BackendSubmission, type: "jnf" | "inf"): JnfFormValues {
  const company = submission.company;
  const profile = submission.profile ?? submission.job_profile ?? submission.internship_profile ?? submission.jobProfile ?? submission.internshipProfile;
  const mode = profile?.work_location_mode;
  const details = submission.details;

  return {
    ...jnfDefaultValues,
    companyProfile: {
      ...jnfDefaultValues.companyProfile,
      companyName: company?.company_name ?? "",
      website: company?.website ?? "",
      address: company?.postal_address ?? "",
      employees: String(company?.no_of_employees ?? ""),
      sector: company?.sector ?? "",
      logoFile: company?.company_logo ?? "",
      orgType: company?.category ?? "",
      establishmentDate: company?.date_of_establishment ?? "",
      annualTurnover: String(company?.annual_turnover ?? ""),
      linkedInUrl: company?.linkedin_url ?? "",
      industryTags: company?.industry_tags ?? [],
      hqLocation: [company?.hq_city, company?.hq_country].filter(Boolean).join(", "),
      description: company?.company_description ?? submission.description ?? ""
    },
    jobProfile: {
      ...jnfDefaultValues.jobProfile,
      jobTitle: submission.title ?? profile?.profile_name ?? "",
      designation: type === "jnf" ? profile?.job_designation ?? "" : profile?.internship_role ?? "",
      location: profile?.place_of_posting ?? "",
      workMode: mode ? mode.slice(0, 1).toUpperCase() + mode.slice(1) : jnfDefaultValues.jobProfile.workMode,
      expectedHires: String(profile?.expected_hires ?? ""),
      minimumHires: String(profile?.minimum_hires ?? ""),
      durationMonths: String(profile?.duration_months ?? ""),
      joiningDate: profile?.tentative_joining_month ?? profile?.internship_start_month ?? "",
      skills: profile?.required_skills ?? [],
      jdContent: profile?.job_description ?? submission.description ?? "",
      jdPdf: profile?.jd_pdf_path ?? "",
      additionalInfo: profile?.additional_info ?? "",
      bondAmount: profile?.bond_details ?? "",
      ppoAvailable: Boolean(profile?.ppo_available),
      onboardingInfo: profile?.onboarding_details ?? "",
      registrationLink: profile?.registration_link ?? jnfDefaultValues.jobProfile.registrationLink
    },
    eligibility: {
      ...jnfDefaultValues.eligibility,
      courses: eligibilityRowsToForm(details?.eligibility ?? [], submission.course_groups ?? [])
    },
    salary: {
      ...jnfDefaultValues.salary,
      currency: details?.salaries?.[0]?.currency ?? jnfDefaultValues.salary.currency,
      salaryRows: jnfDefaultValues.salary.salaryRows.map((row, index) => {
        const salary = details?.salaries?.[index];

        return {
          ...row,
          ctc: String(salary?.ctc ?? ""),
          base: String(salary?.base_salary ?? ""),
          monthlyTakeHome: String(salary?.in_hand ?? salary?.stipend ?? "")
        };
      })
    },
    selectionProcess: {
      ...jnfDefaultValues.selectionProcess,
      stages: details?.selection_process?.rounds?.length
        ? details.selection_process.rounds
            .slice()
            .sort((a, b) => (a.round_order ?? 0) - (b.round_order ?? 0))
            .map((round) => ({
              stage: round.round_type ? round.round_type.slice(0, 1).toUpperCase() + round.round_type.slice(1) : "Round",
              mode: round.mode ? round.mode.slice(0, 1).toUpperCase() + round.mode.slice(1) : "Online",
              testType: round.round_type ?? "",
              duration: String(round.duration_minutes ?? ""),
              interviewMode: round.interview_mode ?? "",
              notes: ""
            }))
        : jnfDefaultValues.selectionProcess.stages,
      psychometricTest: Boolean(details?.selection_process?.psychometric_test),
      medicalTest: Boolean(details?.selection_process?.medical_test),
      otherScreening: details?.selection_process?.other_screening ?? "",
      infrastructureNeeds: details?.selection_process?.infrastructure_details ?? ""
    }
  };
}

function eligibilityRowsToForm(rows: NonNullable<BackendDetails["eligibility"]>, courseGroups: BackendCourseGroup[]) {
  const byBranchId = new Map(rows.map((row) => [row.branch_id, row]));
  const courses: JnfFormValues["eligibility"]["courses"] = {};

  courseGroups.forEach((course) => {
    const selectedRows = course.branches
      .filter((branch) => byBranchId.has(branch.branch_id))
      .map((branch) => {
        const saved = byBranchId.get(branch.branch_id);

        return {
          branchId: branch.branch_id,
          selected: true,
          branch: branch.branch_name,
          department: branch.department_name ?? "",
          cgpa: String(saved?.min_cgpa ?? "0.00"),
          backlogsAllowed: Boolean(saved?.backlog_allowed),
          majorSelected: true,
          minorSelected: false,
          minorCgpa: "0.00"
        };
      });

    if (selectedRows.length > 0) {
      courses[`course_${course.course_id}`] = selectedRows;
    }
  });

  return courses;
}

export async function fetchNotifications(token: string): Promise<NotificationItem[]> {
  const response = await fetch(`${backendApiBaseUrl}/notifications`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  }).catch(() => null);

  if (!response?.ok) {
    return [];
  }

  const payload = await response.json();
  return payload.data ?? [];
}

export async function markNotificationRead(token: string, id: number) {
  await fetch(`${backendApiBaseUrl}/notifications/${id}/read`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
}

export async function markAllNotificationsRead(token: string) {
  await fetch(`${backendApiBaseUrl}/notifications/mark-all-read`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
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

async function throwApiError(response: Response, fallback: string) {
  if (response.ok) {
    return;
  }

  const payload = await response.json().catch(() => null);
  throw new Error(payload?.message ?? fallback);
}
