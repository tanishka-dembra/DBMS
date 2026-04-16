import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Card, CardContent, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProposalList } from "@/features/dashboard/components/ProposalList";
import { authOptions } from "@/lib/auth";
import { dashboardToProposals, fetchCompanyDashboard } from "@/services/api/submissions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const companyName = session?.user?.companyName ?? "Recruiter Workspace";
  const contactName = session?.user?.name ?? "Recruiter";
  const dashboard = session?.user?.apiToken ? await fetchCompanyDashboard(session.user.apiToken) : {};
  const proposals = dashboardToProposals(dashboard);
  const jnfCounts = dashboard.jnfs_by_status ?? {};

  return (
    <DashboardShell title="Recruiter Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(230, 244, 225, 0.98), rgba(255, 255, 255, 0.98))",
              border: "1px solid rgba(31, 107, 45, 0.12)"
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={3}>
                <Box>
                  <Typography variant="overline" color="primary" fontWeight={900} letterSpacing={2}>
                    {companyName}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} gutterBottom>
                    Welcome back, {contactName}.
                  </Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                    Create new submissions, continue incomplete drafts, and track every active JNF or INF proposal
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                  <Button href="/jnf/new?fresh=1" variant="contained" startIcon={<AddIcon />} size="large">
                    Create JNF
                  </Button>
                  <Button href="/inf/new" variant="outlined" startIcon={<AddIcon />} size="large">
                    Create INF
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Total JNFs" value={dashboard.totals?.jnfs ?? 0} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Pending Reviews" value={jnfCounts.submitted ?? 0} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Accepted JNFs" value={jnfCounts.approved ?? 0} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ProposalList title="Current Proposals" proposals={proposals} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
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
