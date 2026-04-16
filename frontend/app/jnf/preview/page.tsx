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
import { fetchSubmission, submissionToFormValues, submitJnfToBackend } from "@/services/api/submissions";

const STORAGE_KEY = "iit-ism-jnf-draft";
const META_STORAGE_KEY = "iit-ism-jnf-draft-meta";

function PreviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const mode = searchParams.get("mode") === "dedicated" ? "dedicated" : "review";
  const requestedId = Number(searchParams.get("id") ?? "");
  const [data, setData] = useState<JnfFormValues | null>(null);
  const [jnfId, setJnfId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPreview = async () => {
      const token = session?.user?.apiToken;
      if (token && Number.isFinite(requestedId) && requestedId > 0) {
        const submission = await fetchSubmission(token, "jnf", requestedId);
        if (submission) {
          setData(submissionToFormValues(submission, "jnf"));
          setJnfId(requestedId);
          return;
        }
      }

      const stored = window.localStorage.getItem(STORAGE_KEY);
      const meta = window.localStorage.getItem(META_STORAGE_KEY);
      setData(stored ? JSON.parse(stored) : jnfDefaultValues);
      setJnfId(meta ? (JSON.parse(meta) as { jnfId?: number }).jnfId ?? null : null);
    };

    void loadPreview();
  }, [requestedId, session?.user?.apiToken]);

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
          const token = session?.user?.apiToken;

          if (!token) {
            enqueueSnackbar("Sign in again before submitting this JNF.", { variant: "error" });
            return;
          }

          setSubmitting(true);
          try {
            await submitJnfToBackend(data, token, jnfId);
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.removeItem(META_STORAGE_KEY);
            enqueueSnackbar("JNF submitted successfully", { variant: "success" });
            router.push("/dashboard");
            router.refresh();
          } catch {
            enqueueSnackbar("Could not submit this JNF. Please try again.", { variant: "error" });
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
