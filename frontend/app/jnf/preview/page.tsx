"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
import { PreviewSummary } from "@/features/jnf/components/PreviewSummary";
import { JnfFormValues } from "@/features/jnf/schemas";
import { mockSubmitJnf } from "@/services/api/mock";

const STORAGE_KEY = "iit-ism-jnf-draft";

function PreviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "dedicated" ? "dedicated" : "review";
  const [data, setData] = useState<JnfFormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setData(stored ? JSON.parse(stored) : jnfDefaultValues);
  }, []);

  if (!data) {
    return (
      <DashboardShell title="Job Notification Form">
        <Card>
          <CardContent>
            <Typography>Loading preview...</Typography>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Job Notification Form">
      <PreviewSummary
        data={data}
        mode={mode}
        basePath="/jnf"
        submitLabel="Submit JNF"
        onSubmit={async () => {
          setSubmitting(true);
          await mockSubmitJnf(data);
          setSubmitting(false);
          enqueueSnackbar("JNF submitted successfully", { variant: "success" });
          router.push("/dashboard");
        }}
        submitting={submitting}
      />
    </DashboardShell>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewPageContent />
    </Suspense>
  );
}
