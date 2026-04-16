type RecruiterNotification = {
  id: string;
  title: string;
  description: string;
  variant: "submitted" | "accepted" | "open_edit";
  href?: string;
  read: boolean;
};

export const dashboardNavItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "New INF", href: "/inf/new" },
  { label: "New JNF", href: "/jnf/new?fresh=1" },
  { label: "My INF", href: "/dashboard/my-infs" },
  { label: "My JNF", href: "/dashboard/my-jnfs" }
];

export const jnfTabs = [
  "Company Profile",
  "Contact & HR Details",
  "Job Profile",
  "Eligibility",
  "Salary",
  "Selection Process",
  "Declaration"
];

export const infTabs = [
  "Company Profile",
  "Contact & HR Details",
  "Internship Profile",
  "Eligibility",
  "Stipend",
  "Selection Process",
  "Declaration"
];

export const workModes = ["Onsite", "Remote", "Hybrid"];
export const genderOptions = ["All", "Male", "Female", "Others"];
export const currencyOptions = ["INR", "USD", "EUR"];
export const selectionModes = ["Online", "Offline", "Hybrid"];
export const testTypes = ["Aptitude", "Technical", "Written"];
export const interviewModes = ["On-campus", "Telephonic", "Video Conferencing"];

export const programRows = [
  "B.Tech / Dual / Int. M.Tech",
  "M.Tech",
  "MBA",
  "M.Sc / M.Sc.Tech",
  "Ph.D"
];

export const additionalSalaryComponentTemplates = [
  "Joining Bonus",
  "Retention Bonus",
  "Variable / Performance Bonus",
  "ESOPs + Vest Period",
  "Relocation Allowance",
  "Medical Allowance",
  "Deductions",
  "First Year CTC",
  "Stocks / Options",
  "CTC Breakup (free text)",
  "Gross Salary"
];

export const declarationItems = [
  "AIPC guidelines have been read and will be followed throughout the placement process.",
  "Shortlisting criteria will be shared and the final shortlist will be released within 24-48 hours after tests.",
  "All details shared in this JNF are verified and no new clauses will be added in the final offer.",
  "Company name, logo, and email may be shared with ranking agencies and media as required.",
  "Results will be shared only with CDC and not directly with students."
];

export const recruiterNotifications: RecruiterNotification[] = [
  {
    id: "notif-jnf-submitted",
    title: "JNF-2026-002 submitted successfully",
    description: "Data Science Analyst",
    variant: "submitted",
    read: false
  },
  {
    id: "notif-jnf-accepted",
    title: "JNF-2026-002 accepted",
    description: "Data Science Analyst",
    variant: "accepted",
    href: "/dashboard/my-jnfs",
    read: false
  },
  {
    id: "notif-inf-open-edit",
    title: "INF-2026-003 opened for edit",
    description: "Finance Internship - Strategy",
    variant: "open_edit",
    href: "/dashboard/my-infs",
    read: true
  }
];

export const recruiterProposals = [
  {
    id: "JNF-2026-001",
    type: "JNF",
    title: "Graduate Engineer Trainee",
    status: "Under Review",
    dateLabel: "Last updated",
    date: "07 Apr 2026",
    action: "Continue",
    href: "/jnf/new?loadDraft=1"
  },
  {
    id: "JNF-2026-002",
    type: "JNF",
    title: "Data Science Analyst",
    status: "Accepted",
    dateLabel: "Submitted on",
    date: "01 Apr 2026",
    action: "View",
    href: "/jnf/preview?mode=review"
  },
  {
    id: "JNF-2026-003",
    type: "JNF",
    title: "Associate Product Engineer",
    status: "Open for Edit",
    dateLabel: "Last updated",
    date: "09 Apr 2026",
    action: "Edit once",
    href: "/jnf/new?loadDraft=1"
  },
  {
    id: "INF-2026-001",
    type: "INF",
    title: "Summer Internship - Software Engineering",
    status: "Under Review",
    dateLabel: "Last updated",
    date: "10 Apr 2026",
    action: "Continue",
    href: "/inf/new"
  },
  {
    id: "INF-2026-002",
    type: "INF",
    title: "Research Internship - Data Analytics",
    status: "Accepted",
    dateLabel: "Submitted on",
    date: "05 Apr 2026",
    action: "View",
    href: "/dashboard/my-infs"
  },
  {
    id: "INF-2026-003",
    type: "INF",
    title: "Finance Internship - Strategy",
    status: "Open for Edit",
    dateLabel: "Last updated",
    date: "11 Apr 2026",
    action: "Edit once",
    href: "/inf/new"
  }
];
