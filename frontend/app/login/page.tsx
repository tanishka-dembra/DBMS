import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { Box, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Typography variant="overline" color="primary.main" fontWeight={800}>
                Recruiters' Corner
              </Typography>
              <Typography variant="h2">Portal login for company representatives and CDC workflows</Typography>
              <Typography color="text.secondary">
                Sign in to continue your company registration, access saved JNFs, and coordinate placement activity
                through one portal.
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 6,
                  bgcolor: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(31,107,45,0.08)"
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(31,107,45,0.12)",
                      color: "primary.main"
                    }}
                  >
                    <LoginRoundedIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>Demo access enabled</Typography>
                    <Typography color="text.secondary">Use the sample credentials shown inside the form.</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <LoginForm />
          </Grid>
        </Grid>
      </Container>
      <PublicFooter />
    </Box>
  );
}
