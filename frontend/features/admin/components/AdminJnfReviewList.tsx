"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { backendApiBaseUrl } from "@/lib/api";

type AdminSubmission = {
  id: number;
  type: "jnf" | "inf";
  jnf_id?: number;
  inf_id?: number;
  title: string | null;
  description: string | null;
  status: "draft" | "submitted" | "approved" | "rejected" | "open_edit";
  edit_request_notes?: string | null;
  edit_request_count?: number;
  created_at: string;
  company?: {
    company_name?: string | null;
    sector?: string | null;
    website?: string | null;
    user?: {
      name?: string | null;
      email?: string | null;
    } | null;
  } | null;
  profile?: {
    profile_name?: string | null;
    job_designation?: string | null;
    internship_role?: string | null;
    place_of_posting?: string | null;
    work_location_mode?: string | null;
    expected_hires?: number | null;
    minimum_hires?: number | null;
    duration_months?: number | null;
    internship_start_month?: string | null;
    tentative_joining_month?: string | null;
    required_skills?: string[] | null;
    job_description?: string | null;
    ppo_available?: boolean | null;
    registration_link?: string | null;
    additional_info?: string | null;
    bond_details?: string | null;
    onboarding_details?: string | null;
  } | null;
  job_profile?: AdminSubmission["profile"];
  internship_profile?: AdminSubmission["profile"];
};

type Props = {
  initialJnfs: AdminSubmission[];
  token: string;
};

export function AdminJnfReviewList({ initialJnfs, token }: Props) {
  const [jnfs, setJnfs] = useState(initialJnfs);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const router = useRouter();

  const updateStatus = async (submission: AdminSubmission, action: "approve" | "reject") => {
    const key = getSubmissionKey(submission);
    setBusyKey(key);
    const response = await fetch(`${backendApiBaseUrl}/admin/${submission.type}s/${submission.id}/${action}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(() => null);
    setBusyKey(null);

    if (!response?.ok) {
      enqueueSnackbar(`Could not ${action} this ${submission.type.toUpperCase()}.`, { variant: "error" });
      return;
    }

    setJnfs((current) => current.filter((item) => getSubmissionKey(item) !== key));
    enqueueSnackbar(action === "approve" ? `${submission.type.toUpperCase()} approved` : `${submission.type.toUpperCase()} rejected`, {
      variant: "success"
    });
    router.refresh();
  };

  const requestEdit = async (submission: AdminSubmission) => {
    const key = getSubmissionKey(submission);
    const notes = editNotes[key]?.trim() ?? "";

    if (notes.length < 10) {
      enqueueSnackbar("Add clear change notes before opening this form for edit.", { variant: "warning" });
      return;
    }

    setBusyKey(key);
    const response = await fetch(`${backendApiBaseUrl}/admin/${submission.type}s/${submission.id}/request-edit`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notes })
    }).catch(() => null);
    setBusyKey(null);

    if (!response?.ok) {
      enqueueSnackbar("This form may already have been opened for edit once.", { variant: "error" });
      return;
    }

    setJnfs((current) => current.filter((item) => getSubmissionKey(item) !== key));
    enqueueSnackbar(`${submission.type.toUpperCase()} opened for edit`, { variant: "success" });
    router.refresh();
  };

  if (jnfs.length === 0) {
    return (
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={900}>
            No submitted forms waiting for review
          </Typography>
          <Typography color="text.secondary" mt={1}>
            New recruiter submissions will appear here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      {jnfs.map((jnf) => {
        const key = getSubmissionKey(jnf);
        const profile = jnf.profile ?? jnf.job_profile ?? jnf.internship_profile;
        const isInf = jnf.type === "inf";
        const title = jnf.title ?? profile?.job_designation ?? profile?.internship_role ?? `Untitled ${jnf.type.toUpperCase()}`;

        return (
          <Card key={key}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={2.5}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                  <Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={`${jnf.type.toUpperCase()}-${jnf.id}`} color="primary" size="small" />
                      <Chip label={jnf.status} variant="outlined" color="warning" size="small" />
                    </Stack>
                    <Typography variant="h5" mt={1} fontWeight={900}>
                      {title}
                    </Typography>
                    <Typography color="text.secondary">
                      {jnf.company?.company_name ?? "Company profile missing"}
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button variant="outlined" onClick={() => setExpandedKey(expandedKey === key ? null : key)}>
                      {expandedKey === key ? "Hide full form" : "View full form"}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={busyKey === key}
                      onClick={() => updateStatus(jnf, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={busyKey === key}
                      onClick={() => updateStatus(jnf, "reject")}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Stack>

                <Divider />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="overline" color="text.secondary">
                      Recruiter
                    </Typography>
                    <Typography fontWeight={800}>{jnf.company?.user?.name ?? "Not provided"}</Typography>
                    <Typography color="text.secondary">{jnf.company?.user?.email ?? "No email"}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="overline" color="text.secondary">
                      {isInf ? "Internship" : "Role"}
                    </Typography>
                    <Typography fontWeight={800}>
                      {isInf ? profile?.internship_role : profile?.job_designation ?? "Not provided"}
                    </Typography>
                    <Typography color="text.secondary">{profile?.place_of_posting ?? "Posting not provided"}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="overline" color="text.secondary">
                      {isInf ? "Interns" : "Hiring"}
                    </Typography>
                    <Typography fontWeight={800}>{profile?.expected_hires ?? "No"} expected {isInf ? "interns" : "hires"}</Typography>
                    <Typography color="text.secondary">
                      {profile?.work_location_mode ?? "Mode not provided"}
                      {isInf && profile?.duration_months ? ` | ${profile.duration_months} months` : ""}
                    </Typography>
                  </Grid>
                </Grid>

                {profile?.required_skills?.length ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {profile.required_skills.map((skill) => (
                      <Chip key={skill} label={skill} variant="outlined" size="small" />
                    ))}
                  </Stack>
                ) : null}

                <Typography color="text.secondary">
                  {profile?.job_description ?? jnf.description ?? "No description provided."}
                </Typography>

                {expandedKey === key ? (
                  <>
                    <Divider />
                    <Grid container spacing={2}>
                      <Detail label="Company sector" value={jnf.company?.sector} />
                      <Detail label="Website" value={jnf.company?.website} />
                      <Detail label={isInf ? "Internship profile" : "Job profile"} value={profile?.profile_name} />
                      <Detail label={isInf ? "Start month" : "Joining month"} value={profile?.internship_start_month ?? profile?.tentative_joining_month} />
                      <Detail label="Minimum hires" value={profile?.minimum_hires} />
                      <Detail label="Registration link" value={profile?.registration_link} />
                      {isInf ? <Detail label="PPO available" value={profile?.ppo_available ? "Yes" : "No"} /> : null}
                      {!isInf ? <Detail label="Bond details" value={profile?.bond_details} /> : null}
                      {!isInf ? <Detail label="Onboarding" value={profile?.onboarding_details} /> : null}
                      <Detail label="Additional information" value={profile?.additional_info} wide />
                    </Grid>

                    <Stack spacing={1.5}>
                      <Typography fontWeight={900}>Open once for company edit</Typography>
                      <TextField
                        label="Changes required from company"
                        value={editNotes[key] ?? ""}
                        onChange={(event) => setEditNotes((current) => ({ ...current, [key]: event.target.value }))}
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Mention the exact corrections needed before approval."
                      />
                      <Button
                        variant="outlined"
                        disabled={busyKey === key || (jnf.edit_request_count ?? 0) >= 1}
                        onClick={() => requestEdit(jnf)}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Open for edit once
                      </Button>
                    </Stack>
                  </>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

function getSubmissionKey(submission: AdminSubmission) {
  return `${submission.type}-${submission.id}`;
}

function Detail({ label, value, wide = false }: { label: string; value?: string | number | null; wide?: boolean }) {
  return (
    <Grid size={{ xs: 12, md: wide ? 12 : 4 }}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={700}>{value || "Not provided"}</Typography>
    </Grid>
  );
}
