"use client";

import Link from "next/link";
import { Checkbox, FormControlLabel, Grid2 as Grid, Stack, Button, Typography } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { declarationItems } from "@/constants/jnf";
import { FormTextField } from "@/components/common/FormTextField";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
  values: JnfFormValues;
  onOpenDedicatedPreview: () => void;
  onReviewBeforeSubmit: () => void;
};

export function DeclarationTab({ control, values, onOpenDedicatedPreview, onReviewBeforeSubmit }: Props) {
  const canReview = Boolean(
    values.declaration.agreements.every(Boolean) &&
      values.declaration.signatoryName.trim() &&
      values.declaration.signatoryDesignation.trim() &&
      values.declaration.signedDate.trim() &&
      values.declaration.typedSignature.trim()
  );

  return (
    <Stack spacing={2.5}>
      {declarationItems.map((item, index) => (
        <Controller
          key={item}
          name={`declaration.agreements.${index}`}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
              label={
                index === 0 ? (
                  <Typography component="span">
                    <Link href="https://www.google.com" target="_blank">
                      AIPC guidelines
                    </Link>{" "}
                    have been read and will be followed throughout the placement process.
                  </Typography>
                ) : (
                  item
                )
              }
            />
          )}
        />
      ))}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormTextField<JnfFormValues> name="declaration.signatoryName" control={control} label="Name" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormTextField<JnfFormValues>
            name="declaration.signatoryDesignation"
            control={control}
            label="Designation"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormTextField<JnfFormValues>
            name="declaration.signedDate"
            control={control}
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField<JnfFormValues>
            name="declaration.typedSignature"
            control={control}
            label="Typed Signature"
            fullWidth
          />
        </Grid>
      </Grid>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="outlined" onClick={onOpenDedicatedPreview}>
          Open Dedicated Preview Page
        </Button>
        <Button variant="contained" onClick={onReviewBeforeSubmit} disabled={!canReview}>
          Review Before Submit
        </Button>
      </Stack>
    </Stack>
  );
}
