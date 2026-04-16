"use client";

import { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, Card, CardContent, Grid2 as Grid, MenuItem, Stack, Typography } from "@mui/material";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { ChipInput } from "@/components/common/ChipInput";
import { FileUploadField } from "@/components/common/FileUploadField";
import { FormTextField } from "@/components/common/FormTextField";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { orgTypes, sectors } from "@/constants/auth";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
  setValue: UseFormSetValue<JnfFormValues>;
};

export function CompanyProfileSection({ control, setValue }: Props) {
  const [descriptionPdfName, setDescriptionPdfName] = useState("");

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={800}>
              Company Profile
            </Typography>
            <Typography color="text.secondary">
              Provide your organisation details before filling the Job Profile section.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.companyName"
                control={control}
                label="Company Name"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.website"
                control={control}
                label="Website"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.address"
                control={control}
                label="Address"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.employees"
                control={control}
                label="Employees"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues> name="companyProfile.sector" control={control} label="Sector" select fullWidth>
                {sectors.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FormTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.orgType"
                control={control}
                label="Organisation Type"
                select
                fullWidth
              >
                {orgTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FormTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.establishmentDate"
                control={control}
                label="Date of Establishment"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.annualTurnover"
                control={control}
                label="Annual Turnover"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.linkedInUrl"
                control={control}
                label="LinkedIn URL"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.hqLocation"
                control={control}
                label="HQ Location"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyProfile.industryTags"
                control={control}
                render={({ field }) => (
                  <ChipInput
                    label="Industry Tags"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Press Enter to add tag"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyProfile.logoFile"
                control={control}
                render={({ field }) => (
                  <FileUploadField label="Company Logo Upload" value={field.value} onChange={field.onChange} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="companyProfile.description"
                control={control}
                render={({ field }) => (
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Company Description
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{ width: { xs: "100%", sm: "fit-content" } }}
                      >
                        Upload PDF for Company Description
                        <input
                          hidden
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              setDescriptionPdfName(file.name);
                              enqueueSnackbar("PDF uploaded. Parsing can be connected later.", { variant: "info" });
                            }
                            event.currentTarget.value = "";
                          }}
                        />
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        disabled={!descriptionPdfName}
                        onClick={() => setDescriptionPdfName("")}
                      >
                        Remove
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        {descriptionPdfName || "Frontend upload is ready. PDF parsing can be connected later."}
                      </Typography>
                    </Stack>
                    <RichTextEditor
                      label="Company Description"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Stack>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setValue("companyProfile.companyName", "IIT ISM Preferred Recruiter");
                  setValue("companyProfile.website", "https://example.com");
                  setValue("companyProfile.address", "Corporate Avenue, New Delhi, India");
                  setValue("companyProfile.employees", "2500");
                  setValue("companyProfile.annualTurnover", "INR 120 Cr");
                  setValue("companyProfile.hqLocation", "New Delhi, India");
                  setValue("companyProfile.linkedInUrl", "https://www.linkedin.com/company/example");
                  setValue("companyProfile.description", "<p>Mock company profile loaded for onboarding review.</p>");
                  setValue("companyProfile.industryTags", ["Technology", "Analytics", "Engineering"]);
                  enqueueSnackbar("Mock company profile auto-filled", { variant: "info" });
                }}
              >
                Autofill from mock company data
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
