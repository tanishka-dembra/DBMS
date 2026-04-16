"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid2 as Grid,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { Controller, Control, FieldPath, UseFormSetValue } from "react-hook-form";
import { FormTextField } from "@/components/common/FormTextField";
import { genderOptions } from "@/constants/jnf";
import { JnfFormValues } from "@/features/jnf/schemas";
import { backendApiBaseUrl } from "@/lib/api";

type CourseBranch = {
  branch_id: number;
  branch_name: string;
  department_name: string | null;
};

type CourseGroup = {
  course_id: number;
  course_name: string;
  branches: CourseBranch[];
};

type Props = {
  
  control: Control<JnfFormValues>;
  values: JnfFormValues;
  setValue: UseFormSetValue<JnfFormValues>;
  onApplySection: (sectionKey: string) => void;
};

const emptySection = {
  cgpa: "0.00",
  backlogsAllowed: true,
  gender: "All",
  highSchoolPercentage: "",
  slpRequirement: ""
};

export function EligibilityTab({ control, values, setValue, onApplySection }: Props) {
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    setLoading(true);
    setLoadError("");

    fetch(`${backendApiBaseUrl}/courses`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload) => {
        if (active) {
          setCourseGroups(Array.isArray(payload) ? payload : []);
        }
      })
      .catch(() => {
        if (active) {
          setCourseGroups([]);
          setLoadError(`Could not load eligibility programs from ${backendApiBaseUrl}/courses.`);
        }
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    courseGroups.forEach((course) => {
      const key = courseKey(course);
      const existingRows = values.eligibility.courses[key] ?? [];
      const existingByBranchId = new Map(existingRows.map((row) => [row.branchId, row]));
      const nextRows = course.branches.map((branch) => {
        const existing = existingByBranchId.get(branch.branch_id);

        return {
          branchId: branch.branch_id,
          selected: existing?.selected ?? false,
          branch: branch.branch_name,
          department: branch.department_name ?? "",
          cgpa: existing?.cgpa ?? "0.00",
          backlogsAllowed: existing?.backlogsAllowed ?? true,
          majorSelected: existing?.majorSelected ?? false,
          minorSelected: existing?.minorSelected ?? false,
          minorCgpa: existing?.minorCgpa ?? "0.00"
        };
      });
      const existingBranchIds = existingRows.map((row) => row.branchId).sort((a, b) => (a ?? 0) - (b ?? 0));
      const nextBranchIds = nextRows.map((row) => row.branchId).sort((a, b) => (a ?? 0) - (b ?? 0));
      const hasMatchingBranches =
        existingBranchIds.length === nextBranchIds.length &&
        existingBranchIds.every((branchId, index) => branchId === nextBranchIds[index]);

      if (!values.eligibility.sections[key]) {
        setValue(`eligibility.sections.${key}` as FieldPath<JnfFormValues>, emptySection);
      }

      if (!hasMatchingBranches) {
        setValue(
          `eligibility.courses.${key}` as FieldPath<JnfFormValues>,
          nextRows
        );
      }
    });
  }, [courseGroups, setValue, values.eligibility.courses, values.eligibility.sections]);

  const visibleGroups = useMemo(
    () => courseGroups.filter((course) => course.branches.length > 0),
    [courseGroups]
  );

  const setAllBranches = (key: string, selected: boolean) => {
    const rows = values.eligibility.courses[key] ?? [];
    rows.forEach((_, index) => {
      setValue(`eligibility.courses.${key}.${index}.selected` as FieldPath<JnfFormValues>, selected);
      setValue(`eligibility.courses.${key}.${index}.majorSelected` as FieldPath<JnfFormValues>, selected);
      if (!selected) {
        setValue(`eligibility.courses.${key}.${index}.minorSelected` as FieldPath<JnfFormValues>, false);
      }
    });

    setExpanded(selected ? key : false);
  };

  if (loading) {
    return (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <CircularProgress size={22} />
        <Typography>Loading eligibility programs from database...</Typography>
      </Stack>
    );
  }

  if (visibleGroups.length === 0) {
    return (
      <Stack spacing={1.5}>
        <Typography color="text.secondary">
          {loadError || "No course and branch data is available yet. Run the backend seeders and try again."}
        </Typography>
        <Button variant="outlined" onClick={() => window.location.reload()} sx={{ alignSelf: "flex-start" }}>
          Reload eligibility data
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Typography variant="h6" fontWeight={900}>
        Select eligible programs or expand to select disciplines individually
      </Typography>

      {visibleGroups.map((course) => {
        const key = courseKey(course);
        const rows = values.eligibility.courses[key] ?? [];
        const section = values.eligibility.sections[key] ?? emptySection;
        const selectedCount = rows.filter((row) => isBranchSelected(row)).length;
        const allSelected = rows.length > 0 && selectedCount === rows.length;
        const hasSelectedBranches = selectedCount > 0;

        return (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? key : false)}
            disableGutters
            sx={{
              border: "1px solid rgba(31, 107, 45, 0.12)",
              boxShadow: "none",
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Grid container spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography fontWeight={900}>{courseLabel(course)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCount}/{rows.length} branches selected
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControlLabel
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        checked={allSelected}
                        indeterminate={selectedCount > 0 && !allSelected}
                        onChange={(_, checked) => setAllBranches(key, checked)}
                      />
                    }
                    label="Select All"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormTextField<JnfFormValues>
                    name={`eligibility.sections.${key}.cgpa` as FieldPath<JnfFormValues>}
                    control={control}
                    label="Minimum CPI"
                    size="small"
                    fullWidth
                    onClick={(event) => event.stopPropagation()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name={`eligibility.sections.${key}.backlogsAllowed` as FieldPath<JnfFormValues>}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        onClick={(event) => event.stopPropagation()}
                        control={<Switch checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
                        label={`Allow Backlogs ${field.value ? "Yes" : "No"}`}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {!hasSelectedBranches ? (
                <Typography color="text.secondary" mb={2}>
                  Select one or more branches to configure eligibility for {course.course_name}.
                </Typography>
              ) : null}
              <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField<JnfFormValues>
                    name={`eligibility.sections.${key}.gender` as FieldPath<JnfFormValues>}
                    control={control}
                    label="Gender Filter"
                    select
                    fullWidth
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </FormTextField>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField<JnfFormValues>
                    name={`eligibility.sections.${key}.highSchoolPercentage` as FieldPath<JnfFormValues>}
                    control={control}
                    label="High School % Requirement"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField<JnfFormValues>
                    name={`eligibility.sections.${key}.slpRequirement` as FieldPath<JnfFormValues>}
                    control={control}
                    label="SLP Requirement"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Button variant="contained" fullWidth onClick={() => onApplySection(key)}>
                    Apply CPI to selected
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Branch</TableCell>
                      <TableCell>Select</TableCell>
                      <TableCell>Minimum CPI</TableCell>
                      <TableCell>Minor</TableCell>
                      <TableCell>Minimum CPI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={`${key}-${row.branchId ?? row.branch}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell padding="checkbox">
                          <Controller
                            name={`eligibility.courses.${key}.${index}.selected` as FieldPath<JnfFormValues>}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={Boolean(field.value)}
                                onChange={(_, checked) => {
                                  field.onChange(checked);
                                  setValue(`eligibility.courses.${key}.${index}.majorSelected` as FieldPath<JnfFormValues>, checked);
                                  if (!checked) {
                                    setValue(`eligibility.courses.${key}.${index}.minorSelected` as FieldPath<JnfFormValues>, false);
                                  }
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 130 }}>
                          {row.selected ? (
                            <Controller
                              name={`eligibility.courses.${key}.${index}.cgpa` as FieldPath<JnfFormValues>}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  fullWidth
                                  placeholder={section.cgpa}
                                  error={Boolean(fieldState.error)}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          ) : null}
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Controller
                            name={`eligibility.courses.${key}.${index}.minorSelected` as FieldPath<JnfFormValues>}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={Boolean(field.value)}
                                disabled={!row.selected}
                                onChange={(_, checked) => field.onChange(checked)}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 130 }}>
                          {row.selected && row.minorSelected ? (
                            <Controller
                              name={`eligibility.courses.${key}.${index}.minorCgpa` as FieldPath<JnfFormValues>}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  fullWidth
                                  placeholder="0.00"
                                  error={Boolean(fieldState.error)}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}

function courseKey(course: CourseGroup) {
  return `course_${course.course_id}`;
}

function courseLabel(course: CourseGroup) {
  return course.course_name;
}

function isBranchSelected(row: JnfFormValues["eligibility"]["courses"][string][number]) {
  return Boolean(row.selected || row.majorSelected || row.minorSelected);
}
