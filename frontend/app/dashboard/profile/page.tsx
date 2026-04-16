import { Card, CardContent, Stack, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <DashboardShell title="Company Profile">
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">{session?.user?.companyName ?? "Company Profile"}</Typography>
            <Typography color="text.secondary">{session?.user?.email ?? "Signed-in recruiter"}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
