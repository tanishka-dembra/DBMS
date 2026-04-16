"use client";

import { Controller, Control } from "react-hook-form";
import { Grid2 as Grid, MenuItem, Stack, Typography } from "@mui/material";
import { ChipInput } from "@/components/common/ChipInput";
import { FileUploadField } from "@/components/common/FileUploadField";
import { FormTextField } from "@/components/common/FormTextField";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { workModes } from "@/constants/jnf";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
};

export function JobProfileTab({ control }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField<JnfFormValues> name="jobProfile.jobTitle" control={control} label="Job Title" fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField<JnfFormValues> name="jobProfile.designation" control={control} label="Designation" fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues> name="jobProfile.location" control={control} label="Location" fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues> name="jobProfile.workMode" control={control} label="Work Mode" select fullWidth>
          {workModes.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </FormTextField>
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.expectedHires"
          control={control}
          label="Expected Hires"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.minimumHires"
          control={control}
          label="Minimum Hires"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.joiningDate"
          control={control}
          label="Joining Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Controller
          name="jobProfile.skills"
          control={control}
          render={({ field }) => (
            <ChipInput label="Skills" value={field.value} onChange={field.onChange} placeholder="Add required skills" />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="jobProfile.jdContent"
          control={control}
          render={({ field }) => <RichTextEditor label="Job Description" value={field.value} onChange={field.onChange} />}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="jobProfile.jdPdf"
          control={control}
          render={({ field }) => (
            <FileUploadField label="Upload JD PDF" value={field.value} accept=".pdf" onChange={field.onChange} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.additionalInfo"
          control={control}
          label="Additional Information"
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <BondDetailsSection control={control} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.onboardingInfo"
          control={control}
          label="Onboarding to Company"
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.registrationLink"
          control={control}
          label="Registration Link"
          fullWidth
        />
      </Grid>
    </Grid>
  );
}

function BondDetailsSection({ control }: { control: Control<JnfFormValues> }) {
  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h6" fontWeight={800}>
          Bond Details
        </Typography>
        <Typography color="text.secondary">
          Add bond-related information only if it applies to this role.
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormTextField<JnfFormValues>
            name="jobProfile.bondAmount"
            control={control}
            label="Bond Amount"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormTextField<JnfFormValues>
            name="jobProfile.bondDuration"
            control={control}
            label="Bond Duration"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormTextField<JnfFormValues>
            name="jobProfile.deductions"
            control={control}
            label="Deductions"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormTextField<JnfFormValues>
            name="jobProfile.medicalRequirements"
            control={control}
            label="Medical Requirements"
            fullWidth
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
