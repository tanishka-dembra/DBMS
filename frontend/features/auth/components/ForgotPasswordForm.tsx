"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { backendApiBaseUrl } from "@/lib/api";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/features/auth/schemas";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    const response = await fetch(`${backendApiBaseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: values.email.trim() })
    }).catch(() => null);
    setLoading(false);

    if (!response?.ok) {
      enqueueSnackbar("Could not start password reset. Try again.", { variant: "error" });
      return;
    }

    enqueueSnackbar("If the email exists, a reset link has been sent.", { variant: "success" });
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Typography variant="h4" gutterBottom>
              Reset your password
            </Typography>
            <Typography color="text.secondary">
              Enter your registered company email. The reset link expires in 30 minutes.
            </Typography>
          </div>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Company Email"
                type="email"
                fullWidth
                autoComplete="email"
                value={field.value ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Remembered it?{" "}
            <Typography component={Link} href="/login" color="primary.main" fontWeight={700}>
              Back to login
            </Typography>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
