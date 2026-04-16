"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { backendApiBaseUrl } from "@/lib/api";
import { resetPasswordSchema, ResetPasswordFormValues } from "@/features/auth/schemas";

type Props = {
  email?: string;
  token?: string;
};

export function ResetPasswordForm({ email = "", token = "" }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      password: "",
      password_confirmation: ""
    }
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setLoading(true);
    const response = await fetch(`${backendApiBaseUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: values.email.trim(),
        token: values.token.trim(),
        password: values.password,
        password_confirmation: values.password_confirmation
      })
    }).catch(() => null);
    setLoading(false);

    if (!response?.ok) {
      enqueueSnackbar("This reset link is invalid or expired.", { variant: "error" });
      return;
    }

    enqueueSnackbar("Password reset successful. You can sign in now.", { variant: "success" });
    router.push("/login");
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Typography variant="h4" gutterBottom>
              Create a new password
            </Typography>
            <Typography color="text.secondary">
              Use the reset details from your email and choose a new password.
            </Typography>
          </div>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Company Email" type="email" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} InputLabelProps={{ shrink: true }} />
            )}
          />
          <Controller
            name="token"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Reset Token" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} InputLabelProps={{ shrink: true }} />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="New Password" type="password" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} InputLabelProps={{ shrink: true }} />
            )}
          />
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Confirm Password" type="password" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} InputLabelProps={{ shrink: true }} />
            )}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Saving..." : "Reset password"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Need a new link?{" "}
            <Typography component={Link} href="/forgot-password" color="primary.main" fontWeight={700}>
              Send reset email
            </Typography>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
