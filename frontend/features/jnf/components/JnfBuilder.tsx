"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Card, CardContent, Stack, Tab, Tabs, Typography } from "@mui/material";
import { FieldPath, useFieldArray, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { additionalSalaryComponentTemplates, jnfTabs } from "@/constants/jnf";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
import { CompanyProfileSection } from "@/features/jnf/components/CompanyProfileSection";
import { ContactHrDetailsTab } from "@/features/jnf/components/ContactHrDetailsTab";
import { DeclarationTab } from "@/features/jnf/components/DeclarationTab";
import { EligibilityTab } from "@/features/jnf/components/EligibilityTab";
import { JobProfileTab } from "@/features/jnf/components/JobProfileTab";
import { SalaryTab } from "@/features/jnf/components/SalaryTab";
import { SelectionProcessTab } from "@/features/jnf/components/SelectionProcessTab";
import { JnfFormValues, jnfSchema } from "@/features/jnf/schemas";
import { fetchSubmission, saveJnfToBackend, submissionToFormValues } from "@/services/api/submissions";

const STORAGE_KEY = "iit-ism-jnf-draft";
const META_STORAGE_KEY = "iit-ism-jnf-draft-meta";
const allowedSalaryComponents = new Set(additionalSalaryComponentTemplates);

const isBranchSelected = (row: JnfFormValues["eligibility"]["courses"][string][number]) =>
  Boolean(row.selected || row.majorSelected || row.minorSelected);

function mergeDraftWithDefaults(parsed: Partial<JnfFormValues>): JnfFormValues {
  return {
    ...jnfDefaultValues,
    ...parsed,
    companyProfile: {
      ...jnfDefaultValues.companyProfile,
      ...parsed.companyProfile
    },
    contactDetails: {
      ...jnfDefaultValues.contactDetails,
      ...parsed.contactDetails,
      headTa: {
        ...jnfDefaultValues.contactDetails.headTa,
        ...parsed.contactDetails?.headTa
      },
      primary: {
        ...jnfDefaultValues.contactDetails.primary,
        ...parsed.contactDetails?.primary
      },
      secondary: {
        ...jnfDefaultValues.contactDetails.secondary,
        ...parsed.contactDetails?.secondary
      }
    },
    jobProfile: {
      ...jnfDefaultValues.jobProfile,
      ...parsed.jobProfile
    },
    eligibility: {
      ...jnfDefaultValues.eligibility,
      ...parsed.eligibility,
      sections: {
        ...jnfDefaultValues.eligibility.sections,
        ...parsed.eligibility?.sections
      },
      courses: {
        ...jnfDefaultValues.eligibility.courses,
        ...parsed.eligibility?.courses
      }
    },
    salary: {
      ...jnfDefaultValues.salary,
      ...parsed.salary,
      salaryRows:
        parsed.salary?.salaryRows?.length && parsed.salary.salaryRows.length > 0
          ? parsed.salary.salaryRows.map((row, index) => ({
              ...jnfDefaultValues.salary.salaryRows[index],
              ...row
            }))
          : jnfDefaultValues.salary.salaryRows,
      sharedComponents:
        parsed.salary?.sharedComponents?.length && parsed.salary.sharedComponents.length > 0
          ? parsed.salary.sharedComponents.filter(
              (component) => component.isCustom || allowedSalaryComponents.has(component.label)
            )
          : jnfDefaultValues.salary.sharedComponents,
      programComponents:
        parsed.salary?.programComponents?.length && parsed.salary.programComponents.length > 0
          ? parsed.salary.programComponents.map((group, index) => ({
              ...jnfDefaultValues.salary.programComponents[index],
              ...group,
              components:
                group.components?.length && group.components.length > 0
                  ? group.components.filter(
                      (component) => component.isCustom || allowedSalaryComponents.has(component.label)
                    )
                  : jnfDefaultValues.salary.programComponents[index].components
            }))
          : jnfDefaultValues.salary.programComponents
    },
    selectionProcess: {
      ...jnfDefaultValues.selectionProcess,
      ...parsed.selectionProcess
    },
    declaration: {
      ...jnfDefaultValues.declaration,
      ...parsed.declaration
    }
  };
}

export function JnfBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const requestedTab = Number(searchParams.get("tab") ?? "0");
  const shouldLoadDraft = searchParams.get("loadDraft") === "1";
  const requestedId = Number(searchParams.get("id") ?? "");
  const [activeTab, setActiveTab] = useState(Number.isNaN(requestedTab) ? 0 : requestedTab);
  const [jnfId, setJnfId] = useState<number | null>(null);

  const form = useForm<JnfFormValues>({
    resolver: zodResolver(jnfSchema),
    defaultValues: jnfDefaultValues,
    mode: "onBlur"
  });

  const { control, getValues, reset, setValue, watch, trigger } = form;
  const selectionRounds = useFieldArray({
    control,
    name: "selectionProcess.stages"
  });

  const tabFields: Array<Array<FieldPath<JnfFormValues>>> = [
    [
      "companyProfile",
      "companyProfile.companyName",
      "companyProfile.website",
      "companyProfile.address",
      "companyProfile.employees",
      "companyProfile.sector",
      "companyProfile.logoFile",
      "companyProfile.orgType",
      "companyProfile.establishmentDate",
      "companyProfile.annualTurnover",
      "companyProfile.linkedInUrl",
      "companyProfile.industryTags",
      "companyProfile.hqLocation",
      "companyProfile.description"
    ],
    [
      "contactDetails",
      "contactDetails.headTa.name",
      "contactDetails.headTa.designation",
      "contactDetails.headTa.email",
      "contactDetails.headTa.mobile",
      "contactDetails.primary.name",
      "contactDetails.primary.designation",
      "contactDetails.primary.email",
      "contactDetails.primary.mobile"
    ],
    [
      "jobProfile",
      "jobProfile.jobTitle",
      "jobProfile.designation",
      "jobProfile.location",
      "jobProfile.workMode",
      "jobProfile.expectedHires",
      "jobProfile.minimumHires",
      "jobProfile.joiningDate",
      "jobProfile.skills",
      "jobProfile.jdContent",
      "jobProfile.additionalInfo",
      "jobProfile.bondAmount",
      "jobProfile.bondDuration",
      "jobProfile.deductions",
      "jobProfile.medicalRequirements",
      "jobProfile.onboardingInfo",
      "jobProfile.registrationLink"
    ],
    [
      "eligibility",
      "eligibility.sections",
      "eligibility.courses"
    ],
    [
      "salary",
      "salary.currency",
      "salary.salaryRows",
      "salary.sharedComponents",
      "salary.programComponents"
    ],
    [
      "selectionProcess",
      "selectionProcess.stages"
    ],
    [
      "declaration",
      "declaration.agreements",
      "declaration.signatoryName",
      "declaration.signatoryDesignation",
      "declaration.signedDate",
      "declaration.typedSignature"
    ]
  ];

  useEffect(() => {
    if (!shouldLoadDraft) {
      reset(jnfDefaultValues);
      window.localStorage.removeItem(META_STORAGE_KEY);
      setJnfId(null);
      return;
    }

    const loadDraft = async () => {
      const token = session?.user?.apiToken;
      if (token && Number.isFinite(requestedId) && requestedId > 0) {
        const submission = await fetchSubmission(token, "jnf", requestedId);
        if (submission) {
          reset(submissionToFormValues(submission, "jnf"));
          setJnfId(requestedId);
          window.localStorage.setItem(META_STORAGE_KEY, JSON.stringify({ jnfId: requestedId }));
          return;
        }
      }

      const stored = window.localStorage.getItem(STORAGE_KEY);
      const meta = window.localStorage.getItem(META_STORAGE_KEY);
      if (stored) {
        reset(mergeDraftWithDefaults(JSON.parse(stored) as Partial<JnfFormValues>));
      }
      if (meta) {
        const parsed = JSON.parse(meta) as { jnfId?: number };
        setJnfId(parsed.jnfId ?? null);
      }
    };

    void loadDraft();
  }, [reset, requestedId, session?.user?.apiToken, shouldLoadDraft]);

  useEffect(() => {
    if (!Number.isNaN(requestedTab) && requestedTab >= 0 && requestedTab < jnfTabs.length) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const persistDraft = async () => {
    const current = getValues();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    const token = session?.user?.apiToken;

    if (!token) {
      throw new Error("Sign in again before saving this JNF.");
    }

    const savedId = await saveJnfToBackend(current, token, jnfId);
    setJnfId(savedId);
    window.localStorage.setItem(META_STORAGE_KEY, JSON.stringify({ jnfId: savedId }));
    return current;
  };

  const openPreview = async (mode: "dedicated" | "review") => {
    const valid = mode === "review" ? await trigger("declaration") : true;
    if (!valid) {
      enqueueSnackbar("Complete the required declaration details before review.", { variant: "warning" });
      return;
    }

    try {
      await persistDraft();
      router.push(`/jnf/preview?mode=${mode}`);
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : "Could not save this JNF.", { variant: "error" });
    }
  };

  const handleTabChange = async (_: React.SyntheticEvent, nextTab: number) => {
    if (nextTab > activeTab) {
      
    if (activeTab === 3) {
      const courses = getValues("eligibility.courses");

      // ✅ Flatten ALL branches across ALL courses
      const allBranches = Object.values(courses).flat();

      // ✅ Check if ANY branch is selected globally
      const hasAtLeastOneSelected = allBranches.some(
        (row) => row.selected || row.majorSelected || row.minorSelected
      );

      if (!hasAtLeastOneSelected) {
        enqueueSnackbar("Please select at least one branch before continuing.", {
          variant: "warning"
        });
        return;
      }
    }
  

  else{
      const valid = await trigger(tabFields[activeTab]);
      if (!valid) {
        enqueueSnackbar("Please fill all required fields in this section before continuing.", { variant: "warning" });
        return;
      }
    }
  }

    try {
      await persistDraft();
      enqueueSnackbar(`${jnfTabs[activeTab]} auto-saved`, { variant: "success" });
      setActiveTab(nextTab);
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : "Could not save this JNF.", { variant: "error" });
    }
  };

  const applySectionEligibility = (sectionKey: string) => {
    const section = getValues(`eligibility.sections.${sectionKey}` as FieldPath<JnfFormValues>) as JnfFormValues["eligibility"]["sections"][string];
    const rows = getValues(`eligibility.courses.${sectionKey}` as FieldPath<JnfFormValues>) as JnfFormValues["eligibility"]["courses"][string];
    const hasSelected = rows.some((row) => isBranchSelected(row));

    if (!hasSelected) {
      enqueueSnackbar("Select at least one branch before applying CPI.", { variant: "warning" });
      return;
    }

    rows.forEach((row, index) => {
      if (isBranchSelected(row)) {
        setValue(`eligibility.courses.${sectionKey}.${index}.cgpa` as FieldPath<JnfFormValues>, section.cgpa);
        setValue(`eligibility.courses.${sectionKey}.${index}.backlogsAllowed` as FieldPath<JnfFormValues>, section.backlogsAllowed);
      }
    });

    enqueueSnackbar("Eligibility criteria applied to selected branches", { variant: "info" });
  };

  const watched = watch();
  const selectedCourseCount = useMemo(
    () =>
      Object.values(watched.eligibility.courses).reduce(
        (count, rows) => count + rows.filter((row) => isBranchSelected(row)).length,
        0
      ),
    [watched.eligibility.courses]
  );

  return (
    <DashboardShell
      title="Create New JNF"
      action={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={async () => {
              try {
                await persistDraft();
                enqueueSnackbar("Draft saved successfully", { variant: "success" });
                router.push("/dashboard");
              } catch (error) {
                enqueueSnackbar(error instanceof Error ? error.message : "Could not save this draft.", { variant: "error" });
              }
            }}
          >
            Save Draft
          </Button>
          <Button variant="contained" onClick={() => openPreview("dedicated")}>
            Open Preview
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Typography variant="h5">Job Notification Form</Typography>
              <Typography color="text.secondary">Selected eligibility rows: {selectedCourseCount}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              {jnfTabs.map((tab) => (
                <Tab key={tab} label={tab} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {activeTab === 0 ? <CompanyProfileSection control={control} setValue={setValue} /> : null}
            {activeTab === 1 ? <ContactHrDetailsTab control={control} /> : null}
            {activeTab === 2 ? <JobProfileTab control={control} /> : null}
            {activeTab === 3 ? (
              <EligibilityTab control={control} values={watched} setValue={setValue} onApplySection={applySectionEligibility} />
            ) : null}
            {activeTab === 4 ? <SalaryTab control={control} values={watched} /> : null}
            {activeTab === 5 ? (
              <SelectionProcessTab
                control={control}
                fields={selectionRounds.fields}
                append={selectionRounds.append}
                remove={selectionRounds.remove}
              />
            ) : null}
            {activeTab === 6 ? (
              <DeclarationTab
                control={control}
                values={watched}
                onOpenDedicatedPreview={() => openPreview("dedicated")}
                onReviewBeforeSubmit={() => openPreview("review")}
              />
            ) : null}
          </CardContent>
        </Card>
      </Stack>
    </DashboardShell>
  );
}
