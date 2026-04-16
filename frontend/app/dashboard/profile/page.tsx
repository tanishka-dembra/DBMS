import { Card, CardContent, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function ProfilePage() {
  return (
    <DashboardShell title="Company Profile">
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">Recruiter Profile</Typography>
            <Typography color="text.secondary">
              This placeholder page is ready for future Laravel-backed recruiter profile editing and contact management.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
