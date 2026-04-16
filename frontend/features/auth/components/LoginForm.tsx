"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button, Card, CardContent, Divider, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { loginSchema, LoginFormValues } from "@/features/auth/schemas";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      email: values.email.trim(),
      password: values.password.trim()
    }).catch(() => null);
    setLoading(false);

    if (response && !response.error) {
      enqueueSnackbar("Login successful", { variant: "success" });
      window.location.href = response.url ?? "/dashboard";
      return;
    }

    if (response?.error) {
      setError("password", { type: "manual", message: "Use the password set during registration" });
    }
    enqueueSnackbar("Login failed. Use a registered email and its saved password.", { variant: "error" });
  };

  return (
    <Card
      className="hover-lift"
      sx={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(244,249,240,0.96))"
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Typography variant="h4" gutterBottom>
              Recruiter Login
            </Typography>
            <Typography color="text.secondary">
              Sign in using the email you registered and the password you created during onboarding.
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    value={field.value ?? ""}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Forgot your password?{" "}
            <Typography component={Link} href="/forgot-password" color="primary.main" fontWeight={700}>
              Reset it here
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New recruiter here?{" "}
            <Typography component={Link} href="/register" color="primary.main" fontWeight={700}>
              Create your account
            </Typography>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
