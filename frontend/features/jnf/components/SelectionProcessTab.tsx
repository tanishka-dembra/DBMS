"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Controller, Control, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from "react-hook-form";
import { Button, Card, CardContent, FormControlLabel, Grid2 as Grid, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { FormTextField } from "@/components/common/FormTextField";
import { interviewModes, selectionModes, testTypes } from "@/constants/jnf";
import { JnfFormValues } from "@/features/jnf/schemas";

type Props = {
  control: Control<JnfFormValues>;
  fields: FieldArrayWithId<JnfFormValues, "selectionProcess.stages", "id">[];
  append: UseFieldArrayAppend<JnfFormValues, "selectionProcess.stages">;
  remove: UseFieldArrayRemove;
};

export function SelectionProcessTab({ control, fields, append, remove }: Props) {
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() =>
          append({
            stage: "Interview",
            mode: "Offline",
            testType: "",
            duration: "30",
            interviewMode: "On-campus",
            notes: ""
          })
        }
      >
        Add Round
      </Button>

      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid key={field.id} size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Round {index + 1}</Typography>
                  {fields.length > 2 && index >= 2 ? (
                    <Button
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => remove(index)}
                    >
                      Delete Round
                    </Button>
                  ) : null}
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      name={`selectionProcess.stages.${index}.stage`}
                      control={control}
                      render={({ field }) => <TextField {...field} label="Stage" fullWidth />}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      name={`selectionProcess.stages.${index}.mode`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Mode" fullWidth>
                          {selectionModes.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Controller
                      name={`selectionProcess.stages.${index}.testType`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Test Type" fullWidth>
                          <MenuItem value="">NA</MenuItem>
                          {testTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Controller
                      name={`selectionProcess.stages.${index}.duration`}
                      control={control}
                      render={({ field }) => <TextField {...field} label="Duration (mins)" fullWidth />}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Controller
                      name={`selectionProcess.stages.${index}.interviewMode`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Interview Mode" fullWidth>
                          <MenuItem value="">NA</MenuItem>
                          {interviewModes.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name={`selectionProcess.stages.${index}.notes`}
                      control={control}
                      render={({ field }) => <TextField {...field} label="Round Notes" fullWidth multiline rows={2} />}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="selectionProcess.psychometricTest"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                label="Psychometric Test"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="selectionProcess.medicalTest"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                label="Medical Test"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField<JnfFormValues>
            name="selectionProcess.infrastructureNeeds"
            control={control}
            label="Infrastructure Requirements"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField<JnfFormValues>
            name="selectionProcess.otherScreening"
            control={control}
            label="Other Screening"
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </>
  );
}
