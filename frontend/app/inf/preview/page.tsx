"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
import { PreviewSummary } from "@/features/jnf/components/PreviewSummary";
import { JnfFormValues } from "@/features/jnf/schemas";
import { fetchSubmission, submissionToFormValues, submitInfToBackend } from "@/services/api/submissions";

const STORAGE_KEY = "iit-ism-inf-draft";
const META_STORAGE_KEY = "iit-ism-inf-draft-meta";

function PreviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const mode = searchParams.get("mode") === "dedicated" ? "dedicated" : "review";
  const requestedId = Number(searchParams.get("id") ?? "");
  const [data, setData] = useState<JnfFormValues | null>(null);
  const [infId, setInfId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPreview = async () => {
      const token = session?.user?.apiToken;
      if (token && Number.isFinite(requestedId) && requestedId > 0) {
        const submission = await fetchSubmission(token, "inf", requestedId);
        if (submission) {
          setData(submissionToFormValues(submission, "inf"));
          setInfId(requestedId);
          return;
        }
      }

      const stored = window.localStorage.getItem(STORAGE_KEY);
      const meta = window.localStorage.getItem(META_STORAGE_KEY);
      setData(stored ? JSON.parse(stored) : jnfDefaultValues);
      setInfId(meta ? (JSON.parse(meta) as { infId?: number }).infId ?? null : null);
    };

    void loadPreview();
  }, [requestedId, session?.user?.apiToken]);

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
          const token = session?.user?.apiToken;

          if (!token) {
            enqueueSnackbar("Sign in again before submitting this INF.", { variant: "error" });
            return;
          }

          setSubmitting(true);
          try {
            await submitInfToBackend(data, token, infId);
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.removeItem(META_STORAGE_KEY);
            enqueueSnackbar("INF submitted successfully", { variant: "success" });
            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            enqueueSnackbar(error instanceof Error ? error.message : "Could not submit this INF.", { variant: "error" });
          } finally {
            setSubmitting(false);
          }
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
