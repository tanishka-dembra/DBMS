import { Box, Card, CardContent, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { AdminLogoutButton } from "@/features/admin/components/AdminLogoutButton";
import { AdminJnfReviewList } from "@/features/admin/components/AdminJnfReviewList";
import { backendApiBaseUrl } from "@/lib/api";
import { authOptions } from "@/lib/auth";

export default async function AdminJnfReviewPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "admin" || !session.user.apiToken) {
    redirect("/admin/login");
  }

  const response = await fetch(`${backendApiBaseUrl}/admin/jnfs`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`
    },
    cache: "no-store"
  }).catch(() => null);

  const payload = response?.ok ? await response.json() : { data: [] };
  const dashboardResponse = await fetch(`${backendApiBaseUrl}/admin/dashboard`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`
    },
    cache: "no-store"
  }).catch(() => null);
  const dashboardPayload = dashboardResponse?.ok ? await dashboardResponse.json() : { data: {} };
  const stats = dashboardPayload.data ?? {};
  const jnfCounts = stats.jnfs_by_status ?? {};

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(230, 244, 225, 0.98), rgba(255, 255, 255, 0.98))",
              border: "1px solid rgba(31, 107, 45, 0.12)"
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="overline" color="primary" fontWeight={900} letterSpacing={2}>
                    Admin Review
                  </Typography>
                  <Typography variant="h4" fontWeight={900} gutterBottom>
                    Submitted JNFs and INFs
                  </Typography>
                  <Typography color="text.secondary">
                    Review company submissions, approve them, reject them, or open a form once for company edits.
                  </Typography>
                </Box>
                <AdminLogoutButton />
              </Stack>
            </CardContent>
          </Card>

          <AdminJnfReviewList initialJnfs={payload.data} token={session.user.apiToken} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <AdminStatCard label="Total JNFs" value={stats.totals?.jnfs ?? 0} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AdminStatCard label="Pending Reviews" value={jnfCounts.submitted ?? 0} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AdminStatCard label="Accepted JNFs" value={jnfCounts.approved ?? 0} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

function AdminStatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={900}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
