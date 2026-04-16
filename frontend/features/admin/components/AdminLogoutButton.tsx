"use client";

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <Button variant="outlined" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      Logout
    </Button>
  );
}
