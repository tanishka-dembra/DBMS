import { Box, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

type Props = {
  searchParams?: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="primary.main" fontWeight={800}>
                Password Reset
              </Typography>
              <Typography variant="h2">Choose a new secure password</Typography>
              <Typography color="text.secondary">
                Reset links expire after 30 minutes and stop working once used.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <ResetPasswordForm email={params?.email ?? ""} token={params?.token ?? ""} />
          </Grid>
        </Grid>
      </Container>
      <PublicFooter />
    </Box>
  );
}
