"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
import { PreviewSummary } from "@/features/jnf/components/PreviewSummary";
import { JnfFormValues } from "@/features/jnf/schemas";
import { mockSubmitInf } from "@/services/api/mock";

const STORAGE_KEY = "iit-ism-inf-draft";

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
      <DashboardShell title="Internship Notification Form">
        <Card>
          <CardContent>
            <Typography>Loading preview...</Typography>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Internship Notification Form">
      <PreviewSummary
        data={data}
        mode={mode}
        basePath="/inf"
        submitLabel="Submit INF"
        formType="inf"
        onSubmit={async () => {
          setSubmitting(true);
          await mockSubmitInf(data);
          setSubmitting(false);
          enqueueSnackbar("INF submitted successfully", { variant: "success" });
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
