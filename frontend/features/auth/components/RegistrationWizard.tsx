"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { FormTextField } from "@/components/common/FormTextField";
import { registrationDefaultValues } from "@/features/auth/defaultValues";
import { RegistrationFormValues, registrationSchema } from "@/features/auth/schemas";
import { useCountdown } from "@/hooks/useCountdown";

const stepFields: Array<Array<keyof RegistrationFormValues>> = [
  ["email", "otp"],
  ["recruiterName", "designation", "contactNumber", "alternateNumber", "password", "confirmPassword"]
];

const stepLabels = ["Email OTP", "Recruiter Details"];

export function RegistrationWizard() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const countdown = useCountdown(60, otpSent);

  const { control, handleSubmit, trigger, getValues } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaultValues
  });

  useEffect(() => {
    if (!otpSent || !countdown.expired) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOtpSent(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [countdown.expired, otpSent]);

  const handleSendOtp = async () => {
    const valid = await trigger("email");
    if (!valid) {
      return;
    }

    setSendingOtp(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: getValues("email") })
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!response.ok || !payload?.ok) {
        enqueueSnackbar(payload?.message ?? "Failed to send OTP. Please try again.", { variant: "error" });
        return;
      }

      setOtpSent(true);
      enqueueSnackbar("OTP sent to your company email. Use the received OTP to continue.", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to send OTP. Please try again.", { variant: "error" });
    } finally {
      setSendingOtp(false);
    }
  };

  const moveNext = async () => {
    const valid = await trigger(stepFields[activeStep]);
    if (!valid) {
      return;
    }

    setActiveStep((current) => current + 1);
  };

  const submitForm = async (values: RegistrationFormValues) => {
    setSubmitting(true);
    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values)
      });
      const registerPayload = (await registerResponse.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!registerResponse.ok || !registerPayload?.ok) {
        enqueueSnackbar(registerPayload?.message ?? "Unable to create recruiter account.", { variant: "error" });
        return;
      }

      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard"
      });

      if (response && !response.error) {
        enqueueSnackbar("Registration complete", { variant: "success" });
        router.push("/dashboard");
        router.refresh();
        return;
      }

      enqueueSnackbar("Registration completed, but automatic login failed.", { variant: "warning" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      className="hover-lift"
      sx={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,249,240,0.98))"
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
        <Stack component="form" spacing={3} onSubmit={handleSubmit(submitForm)}>
          <Stack spacing={1}>
            <Typography variant="h4">Recruiter Registration</Typography>
            <Typography color="text.secondary">
              Complete email verification and recruiter contact details to start submitting JNFs.
            </Typography>
          </Stack>

          <Stepper activeStep={activeStep} alternativeLabel>
            {stepLabels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormTextField<RegistrationFormValues>
                  name="email"
                  control={control}
                  label="Company Email"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || otpSent}
                  fullWidth
                  size="large"
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues> name="otp" control={control} label="Enter OTP" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={700}>OTP Timer</Typography>
                    <Typography color={countdown.expired ? "error.main" : "text.secondary"}>
                      {otpSent ? countdown.label : "01:00"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={700}>reCAPTCHA Placeholder</Typography>
                    <Typography color="text.secondary">Ready for backend integration.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : null}

          {activeStep === 1 ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues>
                  name="recruiterName"
                  control={control}
                  label="Recruiter Name"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues>
                  name="designation"
                  control={control}
                  label="Designation"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues>
                  name="contactNumber"
                  control={control}
                  label="Contact Number (+91)"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues>
                  name="alternateNumber"
                  control={control}
                  label="Alternate Number"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues>
                  name="password"
                  control={control}
                  label="Password"
                  type="password"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField<RegistrationFormValues>
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                />
              </Grid>
            </Grid>
          ) : null}

          <Stack direction="row" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={() => setActiveStep((current) => current - 1)}>
              Back
            </Button>
            {activeStep < stepLabels.length - 1 ? (
              <Button variant="contained" onClick={moveNext}>
                Continue
              </Button>
            ) : (
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Creating account..." : "Complete Registration"}
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
