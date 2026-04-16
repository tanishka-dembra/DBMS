"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Divider, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { JnfFormValues } from "@/features/jnf/schemas";
import { currencyLabel, formatDate } from "@/utils/format";

type Props = {
  data: JnfFormValues;
  mode?: "dedicated" | "review";
  basePath?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  submitting?: boolean;
  formType?: "jnf" | "inf";
};

const SummaryRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Stack spacing={0.5}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </Stack>
);

const PreviewSection = ({
  title,
  editTab,
  basePath,
  children
}: {
  title: string;
  editTab: number;
  basePath: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
        <Button component={Link} href={`${basePath}/new?loadDraft=1&tab=${editTab}`} variant="outlined" size="small">
          Edit
        </Button>
      </Stack>
      {children}
    </CardContent>
  </Card>
);

export function PreviewSummary({
  data,
  mode = "review",
  basePath = "/jnf",
  submitLabel = "Submit JNF",
  onSubmit,
  submitting,
  formType = "jnf"
}: Props) {
  const isInf = formType === "inf";
  const filledSharedComponents = data.salary.sharedComponents.filter(
    (component) => component.label.trim() && component.value.trim()
  );
  const filledProgramComponents = data.salary.programComponents
    .map((group) => ({
      ...group,
      components: group.components.filter((component) => component.label.trim() && component.value.trim())
    }))
    .filter((group) => group.components.length > 0);
  const isBranchSelected = (row: JnfFormValues["eligibility"]["courses"][string][number]) =>
    Boolean(row.selected || row.majorSelected || row.minorSelected);

  return (
    <Stack spacing={3}>
      <PreviewSection title="Company Profile" editTab={0} basePath={basePath}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label="Company Name" value={data.companyProfile.companyName} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label="Website" value={data.companyProfile.website} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SummaryRow label="Address" value={data.companyProfile.address} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label="Sector" value={data.companyProfile.sector} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label="HQ Location" value={data.companyProfile.hqLocation} />
          </Grid>
        </Grid>
      </PreviewSection>

      <PreviewSection title="Contact & HR Details" editTab={1} basePath={basePath}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow
              label="Primary Contact"
              value={`${data.contactDetails.primary.name} | ${data.contactDetails.primary.designation}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow
              label="Primary Email"
              value={`${data.contactDetails.primary.email} | ${data.contactDetails.primary.mobile}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow
              label="Head TA Contact"
              value={`${data.contactDetails.headTa.name} | ${data.contactDetails.headTa.designation}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow
              label="Head TA Email"
              value={`${data.contactDetails.headTa.email} | ${data.contactDetails.headTa.mobile}`}
            />
          </Grid>
        </Grid>
      </PreviewSection>

      <PreviewSection title={isInf ? "Internship Profile" : "Job Profile"} editTab={2} basePath={basePath}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label={isInf ? "Internship Title" : "Job Title"} value={data.jobProfile.jobTitle} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label={isInf ? "Internship Role" : "Designation"} value={data.jobProfile.designation} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label="Location" value={data.jobProfile.location} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryRow label={isInf ? "Internship Start Date" : "Joining Date"} value={formatDate(data.jobProfile.joiningDate)} />
          </Grid>
          {isInf ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <SummaryRow label="Duration" value={data.jobProfile.durationMonths ? `${data.jobProfile.durationMonths} months` : "Not provided"} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SummaryRow label="PPO Available" value={data.jobProfile.ppoAvailable ? "Yes" : "No"} />
              </Grid>
            </>
          ) : null}
          <Grid size={{ xs: 12 }}>
            <SummaryRow label={isInf ? "Preferred Skills" : "Skills"} value={data.jobProfile.skills.join(", ")} />
          </Grid>
          {!isInf ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <SummaryRow label="Bond Amount" value={data.jobProfile.bondAmount || "Not provided"} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SummaryRow label="Bond Duration" value={data.jobProfile.bondDuration || "Not provided"} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SummaryRow label="Deductions" value={data.jobProfile.deductions || "Not provided"} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SummaryRow
                  label="Medical Requirements"
                  value={data.jobProfile.medicalRequirements || "Not provided"}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <SummaryRow label="Onboarding to Company" value={data.jobProfile.onboardingInfo || "Not provided"} />
              </Grid>
            </>
          ) : null}
        </Grid>
      </PreviewSection>

      <PreviewSection title="Eligibility" editTab={3} basePath={basePath}>
        <Stack spacing={1}>
          {Object.entries(data.eligibility.courses).map(([key, rows]) => {
            const section = data.eligibility.sections[key as keyof typeof data.eligibility.sections];
            return (
              <Box key={key}>
                <Typography fontWeight={700} textTransform="capitalize">
                  {key}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CGPA {section.cgpa} | Gender {section.gender} | High school % {section.highSchoolPercentage} | SLP{" "}
                  {section.slpRequirement}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rows.filter((row) => isBranchSelected(row)).length} branches selected
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </PreviewSection>

      <PreviewSection title={isInf ? "Stipend" : "Salary"} editTab={4} basePath={basePath}>
        <Stack spacing={1.5}>
          {data.salary.salaryRows.map((row) => (
            <Box key={row.program}>
              <Typography fontWeight={700}>
                {row.program}: {currencyLabel(data.salary.currency)} {row.ctc || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Base {row.base || "N/A"} | In Hand {row.monthlyTakeHome || "N/A"}
              </Typography>
            </Box>
          ))}
          {data.salary.sameForAll && filledSharedComponents.length > 0 ? (
            <Box>
              <Typography fontWeight={700}>Additional Salary Components</Typography>
              <Typography variant="body2" color="text.secondary">
                {filledSharedComponents.map((component) => `${component.label}: ${component.value}`).join(" | ")}
              </Typography>
            </Box>
          ) : null}
          {!data.salary.sameForAll && filledProgramComponents.length > 0
            ? filledProgramComponents.map((group) => (
                <Box key={group.program}>
                  <Typography fontWeight={700}>{group.program} additional components</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {group.components.map((component) => `${component.label}: ${component.value}`).join(" | ")}
                  </Typography>
                </Box>
              ))
            : null}
        </Stack>
      </PreviewSection>

      <PreviewSection title="Selection Process" editTab={5} basePath={basePath}>
        <Stack spacing={1.5}>
          {data.selectionProcess.stages.map((stage, index) => (
            <Box key={`${stage.stage}-${index}`}>
              <Typography fontWeight={700}>
                {index + 1}. {stage.stage}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stage.mode} | {stage.testType || stage.interviewMode || "General"} | {stage.duration} mins
              </Typography>
              {stage.notes ? (
                <Typography variant="body2" color="text.secondary">
                  {stage.notes}
                </Typography>
              ) : null}
            </Box>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography color="text.secondary">
          Psychometric Test: {data.selectionProcess.psychometricTest ? "Yes" : "No"} | Medical Test:{" "}
          {data.selectionProcess.medicalTest ? "Yes" : "No"}
        </Typography>
        {(data.selectionProcess.infrastructureNeeds || data.selectionProcess.otherScreening) ? (
          <Stack spacing={1} mt={2}>
            <SummaryRow
              label="Infrastructure Requirements"
              value={data.selectionProcess.infrastructureNeeds || "Not provided"}
            />
            <SummaryRow label="Other Screening" value={data.selectionProcess.otherScreening || "Not provided"} />
          </Stack>
        ) : null}
      </PreviewSection>

      {mode === "review" ? (
        <PreviewSection title="Declaration" editTab={6} basePath={basePath}>
          <Typography color="text.secondary">
            Signatory: {data.declaration.signatoryName} | {data.declaration.signatoryDesignation} |{" "}
            {formatDate(data.declaration.signedDate)}
          </Typography>
          <Typography mt={1}>Typed Signature: {data.declaration.typedSignature}</Typography>
        </PreviewSection>
      ) : null}

      {mode === "review" && onSubmit ? (
        <Button variant="contained" size="large" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : submitLabel}
        </Button>
      ) : null}
    </Stack>
  );
}
