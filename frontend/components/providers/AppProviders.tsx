"use client";

import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { ThemeRegistry } from "@/theme/ThemeRegistry";

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <SessionProvider basePath="/api/auth" refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <ThemeRegistry>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={2500}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {children}
        </SnackbarProvider>
      </ThemeRegistry>
    </SessionProvider>
  );
}
