import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Card, CardContent, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { recruiterProposals } from "@/constants/jnf";
import { ProposalList } from "@/features/dashboard/components/ProposalList";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const companyName = session?.user?.companyName ?? "Recruiter Workspace";
  const contactName = session?.user?.name ?? "Recruiter";

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
          <ProposalList title="Current Proposals" proposals={recruiterProposals} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}
