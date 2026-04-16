"use client";

import { Control, Controller, useFieldArray } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import { FormTextField } from "@/components/common/FormTextField";
import { currencyOptions } from "@/constants/jnf";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
  values: JnfFormValues;
};

type SalaryComponentsEditorProps = {
  control: Control<JnfFormValues>;
  name: `salary.sharedComponents` | `salary.programComponents.${number}.components`;
  addLabel: string;
};

const componentCardSx = {
  border: "1px solid rgba(31, 107, 45, 0.12)",
  borderRadius: 1,
  backgroundColor: "background.paper",
  boxShadow: "0 10px 24px rgba(22, 58, 24, 0.04)"
} as const;

function SalaryComponentsEditor({ control, name, addLabel }: SalaryComponentsEditorProps) {
  const fieldArray = useFieldArray({
    control,
    name
  });

  return (
    <Stack spacing={1.5}>
      <Grid container spacing={1.5}>
        {fieldArray.fields.map((field, index) => {
          const componentLabelPath = `${name}.${index}.label` as const;
          const componentValuePath = `${name}.${index}.value` as const;
          const isCustomPath = `${name}.${index}.isCustom` as const;
          const isCtcBreakup = field.label.toLowerCase().includes("ctc breakup");

          return (
            <Grid key={field.id} size={{ xs: 12, md: 6, lg: 3 }}>
              <Box sx={{ ...componentCardSx, p: 1.5, height: "100%" }}>
                <Stack spacing={1.25}>
                  <Controller
                    name={isCustomPath}
                    control={control}
                    render={({ field: isCustomField }) =>
                      isCustomField.value ? (
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <Controller
                            name={componentLabelPath}
                            control={control}
                            render={({ field: labelField }) => (
                              <TextField
                                {...labelField}
                                size="small"
                                label="Component"
                                fullWidth
                                value={labelField.value ?? ""}
                              />
                            )}
                          />
                          <Button
                            color="inherit"
                            onClick={() => fieldArray.remove(index)}
                            sx={{ minWidth: "auto", px: 1, py: 1 }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </Stack>
                      ) : (
                        <Typography fontWeight={700} color="text.primary">
                          {field.label}
                        </Typography>
                      )
                    }
                  />

                  <Controller
                    name={componentValuePath}
                    control={control}
                    render={({ field: valueField }) => (
                      <TextField
                        {...valueField}
                        size="small"
                        label="Value"
                        fullWidth
                        multiline={isCtcBreakup}
                        minRows={isCtcBreakup ? 3 : undefined}
                        value={valueField.value ?? ""}
                      />
                    )}
                  />
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() =>
            fieldArray.append({
              label: "",
              value: "",
              isCustom: true
            })
          }
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          {addLabel}
        </Button>
      </Box>
    </Stack>
  );
}

type ProgramComponentsAccordionProps = {
  control: Control<JnfFormValues>;
  title: string;
  index: number;
};

function ProgramComponentsAccordion({ control, title, index }: ProgramComponentsAccordionProps) {
  return (
    <Accordion
      defaultExpanded={index === 0}
      disableGutters
      sx={{
        border: "1px solid rgba(31, 107, 45, 0.12)",
        borderRadius: 1,
        boxShadow: "none",
        overflow: "hidden",
        "&:before": { display: "none" }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "rgba(220, 236, 199, 0.7)",
          color: "text.primary",
          minHeight: 56
        }}
      >
        <Typography fontWeight={700}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1.5 }}>
        <SalaryComponentsEditor
          control={control}
          name={`salary.programComponents.${index}.components`}
          addLabel={`Add more for ${title}`}
        />
      </AccordionDetails>
    </Accordion>
  );
}

export function SalaryTab({ control, values }: Props) {
  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormTextField<JnfFormValues> name="salary.currency" control={control} label="Currency" select fullWidth>
          {currencyOptions.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </FormTextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Program</TableCell>
              <TableCell>CTC (Annual)</TableCell>
              <TableCell>Base/Fixed</TableCell>
              <TableCell>In Hand</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.salary.salaryRows.map((row, index) => (
              <TableRow key={row.program}>
                <TableCell>{row.program}</TableCell>
                <TableCell>
                  <Controller
                    name={`salary.salaryRows.${index}.ctc`}
                    control={control}
                    render={({ field }) => <TextField {...field} size="small" fullWidth value={field.value ?? ""} />}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`salary.salaryRows.${index}.base`}
                    control={control}
                    render={({ field }) => <TextField {...field} size="small" fullWidth value={field.value ?? ""} />}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`salary.salaryRows.${index}.monthlyTakeHome`}
                    control={control}
                    render={({ field }) => <TextField {...field} size="small" fullWidth value={field.value ?? ""} />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            border: "1px solid rgba(31, 107, 45, 0.12)",
            borderRadius: 1,
            overflow: "hidden",
            backgroundColor: "background.paper"
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={1.5}
            sx={{
              background: "linear-gradient(135deg, rgba(230, 244, 225, 0.98), rgba(255, 255, 255, 0.98))",
              color: "text.primary",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid rgba(31, 107, 45, 0.1)"
            }}
          >
            <Stack spacing={0.25}>
              <Typography fontWeight={800}>Additional Salary Components</Typography>
              <Typography variant="body2" color="text.secondary">
                Keep a shared structure for all programmes or switch to programme-specific components.
              </Typography>
            </Stack>
            <Controller
              name="salary.sameForAll"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{
                    m: 0,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                    bgcolor: field.value ? "secondary.main" : "rgba(31, 107, 45, 0.06)",
                    border: "1px solid rgba(31, 107, 45, 0.12)"
                  }}
                  control={
                    <Switch
                      size="small"
                      color="primary"
                      checked={field.value}
                      onChange={(_, checked) => field.onChange(checked)}
                    />
                  }
                  label={field.value ? "Same structure for all" : "Different structure per programme"}
                />
              )}
            />
          </Stack>

          <Box sx={{ p: 2, backgroundColor: "rgba(242, 247, 239, 0.55)" }}>
            {values.salary.sameForAll ? (
              <SalaryComponentsEditor
                control={control}
                name="salary.sharedComponents"
                addLabel="Add more in additional salary components"
              />
            ) : (
              <Stack spacing={1.5}>
                {values.salary.programComponents.map((program, index) => (
                  <ProgramComponentsAccordion
                    key={program.program}
                    control={control}
                    title={program.program}
                    index={index}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
