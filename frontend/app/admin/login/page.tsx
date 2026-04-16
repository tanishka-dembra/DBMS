import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { Box, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";
import { authOptions } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "admin") {
    redirect("/admin/jnfs");
  }

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Typography variant="overline" color="primary.main" fontWeight={800}>
                CDC Review Desk
              </Typography>
              <Typography variant="h2">Admin access for submitted JNF review</Typography>
              <Typography color="text.secondary">
                Sign in with the CDC admin account to inspect company submissions and update their review status.
              </Typography>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(31,107,45,0.12)",
                  color: "primary.main"
                }}
              >
                <AdminPanelSettingsRoundedIcon fontSize="large" />
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <AdminLoginForm />
          </Grid>
        </Grid>
      </Container>
      <PublicFooter />
    </Box>
  );
}
