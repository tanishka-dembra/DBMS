"use client";

import { Card, CardContent, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { Control } from "react-hook-form";
import { FormTextField } from "@/components/common/FormTextField";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
};

export function ContactHrDetailsTab({ control }: Props) {
  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography fontWeight={800}>Head Talent Acquisition *</Typography>
                <FormTextField<JnfFormValues>
                  name="contactDetails.headTa.name"
                  control={control}
                  label="Full Name"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.headTa.designation"
                  control={control}
                  label="Designation"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.headTa.email"
                  control={control}
                  label="Email Address"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.headTa.mobile"
                  control={control}
                  label="Mobile Number (+91)"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.headTa.landline"
                  control={control}
                  label="Landline (Optional)"
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography fontWeight={800}>Primary Contact (PoC 1) *</Typography>
                <FormTextField<JnfFormValues>
                  name="contactDetails.primary.name"
                  control={control}
                  label="Full Name"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.primary.designation"
                  control={control}
                  label="Designation"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.primary.email"
                  control={control}
                  label="Email Address"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.primary.mobile"
                  control={control}
                  label="Mobile Number (+91)"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.primary.landline"
                  control={control}
                  label="Landline (Optional)"
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography fontWeight={800}>Secondary Contact (PoC 2) (Optional)</Typography>
                <FormTextField<JnfFormValues>
                  name="contactDetails.secondary.name"
                  control={control}
                  label="Full Name"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.secondary.designation"
                  control={control}
                  label="Designation"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.secondary.email"
                  control={control}
                  label="Email Address"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.secondary.mobile"
                  control={control}
                  label="Mobile Number (+91)"
                  fullWidth
                />
                <FormTextField<JnfFormValues>
                  name="contactDetails.secondary.landline"
                  control={control}
                  label="Landline (Optional)"
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
