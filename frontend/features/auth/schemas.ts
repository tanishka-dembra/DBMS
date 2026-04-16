import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z.string().email("Enter a valid company email"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    recruiterName: z.string().min(2, "Recruiter name is required"),
    designation: z.string().min(2, "Designation is required"),
    contactNumber: z.string().min(10, "Contact number is required"),
    alternateNumber: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password")
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const loginSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Enter your registered password")
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email")
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    token: z.string().min(20, "Enter the reset token from your email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Confirm your password")
  })
  .refine((value) => value.password === value.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"]
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
