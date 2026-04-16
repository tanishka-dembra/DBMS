"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Card, CardContent, Stack, Tab, Tabs, Typography } from "@mui/material";
import { FieldPath, useFieldArray, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { additionalSalaryComponentTemplates, infTabs } from "@/constants/jnf";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
import { CompanyProfileSection } from "@/features/jnf/components/CompanyProfileSection";
import { ContactHrDetailsTab } from "@/features/jnf/components/ContactHrDetailsTab";
import { DeclarationTab } from "@/features/jnf/components/DeclarationTab";
import { EligibilityTab } from "@/features/jnf/components/EligibilityTab";
import { InternshipProfileTab } from "@/features/inf/components/InternshipProfileTab";
import { SalaryTab } from "@/features/jnf/components/SalaryTab";
import { SelectionProcessTab } from "@/features/jnf/components/SelectionProcessTab";
import { JnfFormValues, jnfSchema } from "@/features/jnf/schemas";
import { mockSaveInf } from "@/services/api/mock";

const STORAGE_KEY = "iit-ism-inf-draft";
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

export function InfBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = Number(searchParams.get("tab") ?? "0");
  const shouldLoadDraft = searchParams.get("loadDraft") === "1";
  const [activeTab, setActiveTab] = useState(Number.isNaN(requestedTab) ? 0 : requestedTab);

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

  const tabFields: Array<Array<FieldPath<JnfFormValues>>> = useMemo(
    () => [
      ["companyProfile"],
      ["contactDetails"],
      ["jobProfile"],
      ["eligibility"],
      ["salary"],
      ["selectionProcess"],
      ["declaration"]
    ],
    []
  );

  useEffect(() => {
    if (!shouldLoadDraft) {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      enqueueSnackbar("No saved draft found for INF.", { variant: "info" });
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<JnfFormValues>;
      reset(mergeDraftWithDefaults(parsed));
      enqueueSnackbar("INF draft loaded.", { variant: "success" });
    } catch {
      enqueueSnackbar("Saved INF draft could not be loaded.", { variant: "error" });
    }
  }, [reset, shouldLoadDraft]);

  useEffect(() => {
    if (!Number.isNaN(requestedTab) && requestedTab >= 0 && requestedTab < infTabs.length) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const persistDraft = async () => {
    const current = getValues();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    await mockSaveInf(current);
    return current;
  };

  const openPreview = async (mode: "dedicated" | "review") => {
    const valid = mode === "review" ? await trigger("declaration") : true;
    if (!valid) {
      enqueueSnackbar("Complete the required declaration details before review.", { variant: "warning" });
      return;
    }

    await persistDraft();
    router.push(`/inf/preview?mode=${mode}`);
  };

  const handleTabChange = async (_: React.SyntheticEvent, nextTab: number) => {
    if (nextTab > activeTab) {
      const valid = await trigger(tabFields[activeTab]);
      if (!valid) {
        enqueueSnackbar("Please fill all required fields in this section before continuing.", { variant: "warning" });
        return;
      }
    }

    await persistDraft();
    enqueueSnackbar(`${infTabs[activeTab]} auto-saved`, { variant: "success" });
    setActiveTab(nextTab);
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
      title="Create New INF"
      action={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={async () => {
              await persistDraft();
              enqueueSnackbar("Draft saved successfully", { variant: "success" });
              router.push("/dashboard");
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
              <Typography variant="h5">Internship Notification Form</Typography>
              <Typography color="text.secondary">Selected eligibility rows: {selectedCourseCount}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              {infTabs.map((tab) => (
                <Tab key={tab} label={tab} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {activeTab === 0 ? <CompanyProfileSection control={control} setValue={setValue} /> : null}
            {activeTab === 1 ? <ContactHrDetailsTab control={control} /> : null}
            {activeTab === 2 ? <InternshipProfileTab control={control} /> : null}
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
