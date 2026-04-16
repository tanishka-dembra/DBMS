import { Box, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="primary.main" fontWeight={800}>
                Account Help
              </Typography>
              <Typography variant="h2">Get back into your recruiter workspace</Typography>
              <Typography color="text.secondary">
                A time-limited reset link will be sent to the registered company email.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <ForgotPasswordForm />
          </Grid>
        </Grid>
      </Container>
      <PublicFooter />
    </Box>
  );
}
