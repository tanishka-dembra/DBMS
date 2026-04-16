import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import { Box, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { RegistrationWizard } from "@/features/auth/components/RegistrationWizard";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={4} alignItems="start">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5} sx={{ position: { md: "sticky" }, top: { md: 110 } }}>
              <Typography variant="overline" color="primary.main" fontWeight={800}>
                Recruiter Onboarding
              </Typography>
              <Typography variant="h2">Create your recruiter account to start a JNF</Typography>
              <Typography color="text.secondary">
                This onboarding flow is structured like an institute-facing recruiter process: verify email, confirm
                representative details, and get ready to submit placement requirements.
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 6,
                  bgcolor: "rgba(255,255,255,0.84)",
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
                    <FactCheckRoundedIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>2-step intake</Typography>
                    <Typography color="text.secondary">Email verification and recruiter details.</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <RegistrationWizard />
          </Grid>
        </Grid>
      </Container>
      <PublicFooter />
    </Box>
  );
}
