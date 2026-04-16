"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button, Card, CardContent, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { loginSchema, LoginFormValues } from "@/features/auth/schemas";

export function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password"
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/admin/jnfs",
      email: values.email.trim(),
      password: values.password.trim(),
      loginType: "admin"
    }).catch(() => null);
    setLoading(false);

    if (response && !response.error) {
      enqueueSnackbar("Admin login successful", { variant: "success" });
      window.location.href = response.url ?? "/admin/jnfs";
      return;
    }

    setError("password", { type: "manual", message: "Use an admin account" });
    enqueueSnackbar("Admin login failed.", { variant: "error" });
  };

  return (
    <Card sx={{ background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,250,243,0.98))" }}>
      <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Typography variant="h4" gutterBottom>
              Admin Login
            </Typography>
            <Typography color="text.secondary">
              Review submitted JNFs and move each form to approved or rejected.
            </Typography>
          </div>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Admin Email"
                    type="email"
                    fullWidth
                    autoComplete="email"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Signing in..." : "Open JNF Review"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
