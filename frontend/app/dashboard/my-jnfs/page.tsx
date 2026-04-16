import { Grid2 as Grid } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { recruiterProposals } from "@/constants/jnf";
import { ProposalList } from "@/features/dashboard/components/ProposalList";

export default function MyJnfsPage() {
  return (
    <DashboardShell title="Recruiter Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ProposalList title="My JNFs" proposals={recruiterProposals.filter((proposal) => proposal.type === "JNF")} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}
