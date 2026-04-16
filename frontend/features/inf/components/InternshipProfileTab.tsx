"use client";

import { Controller, Control } from "react-hook-form";
import { FormControlLabel, Grid2 as Grid, MenuItem, Switch } from "@mui/material";
import { ChipInput } from "@/components/common/ChipInput";
import { FileUploadField } from "@/components/common/FileUploadField";
import { FormTextField } from "@/components/common/FormTextField";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { workModes } from "@/constants/jnf";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
};

export function InternshipProfileTab({ control }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.jobTitle"
          control={control}
          label="Internship Title"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.designation"
          control={control}
          label="Internship Role"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.location"
          control={control}
          label="Internship Location"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues> name="jobProfile.workMode" control={control} label="Internship Mode" select fullWidth>
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
          label="Expected Interns"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.minimumHires"
          control={control}
          label="Minimum Interns"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.durationMonths"
          control={control}
          label="Duration (months)"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.joiningDate"
          control={control}
          label="Internship Start Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="jobProfile.ppoAvailable"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
              label="PPO may be offered"
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="jobProfile.skills"
          control={control}
          render={({ field }) => (
            <ChipInput
              label="Preferred Skills"
              value={field.value}
              onChange={field.onChange}
              placeholder="Add internship skills"
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="jobProfile.jdContent"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              label="Internship Work Description"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="jobProfile.jdPdf"
          control={control}
          render={({ field }) => (
            <FileUploadField label="Upload Internship PDF" value={field.value} accept=".pdf" onChange={field.onChange} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <FormTextField<JnfFormValues>
          name="jobProfile.additionalInfo"
          control={control}
          label="Internship Notes"
          fullWidth
          multiline
          rows={4}
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
