import { Grid2 as Grid } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProposalList } from "@/features/dashboard/components/ProposalList";
import { authOptions } from "@/lib/auth";
import { fetchCompanySubmissions } from "@/services/api/submissions";

export default async function MyInfsPage() {
  const session = await getServerSession(authOptions);
  const proposals = session?.user?.apiToken ? await fetchCompanySubmissions(session.user.apiToken, "inf") : [];

  return (
    <DashboardShell title="Recruiter Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ProposalList title="My INFs" proposals={proposals} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}
