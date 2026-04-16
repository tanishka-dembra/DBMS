"use client";

import { useEffect, useState } from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

type Props<T extends FieldValues> = TextFieldProps & {
  name: FieldPath<T>;
  control: Control<T>;
};

export function FormTextField<T extends FieldValues>({ name, control, ...props }: Props<T>) {
  const fieldName = String(name);
  const shouldRememberValue = /^(companyProfile|contactDetails|jobProfile|eligibility|salary|selectionProcess|declaration)\./.test(
    fieldName
  );
  const memoryKey = `jnf-field-memory:${fieldName}`;
  const [suggestion, setSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !shouldRememberValue) {
      return;
    }

    const stored = window.localStorage.getItem(memoryKey);
    if (stored) {
      setSuggestion(stored);
    }
  }, [memoryKey]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          value={field.value ?? ""}
          InputLabelProps={{
            ...props.InputLabelProps,
            shrink: props.InputLabelProps?.shrink ?? true
          }}
          error={!!fieldState.error}
          placeholder={
            shouldRememberValue && !field.value && showSuggestion && suggestion && props.type !== "date"
              ? `Last used: ${suggestion}`
              : props.placeholder
          }
          helperText={
            fieldState.error?.message ??
            (shouldRememberValue && showSuggestion && suggestion && !field.value
              ? `Suggestion available: ${suggestion}`
              : props.helperText)
          }
          onFocus={(event) => {
            if (shouldRememberValue) {
              setShowSuggestion(true);
            }
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setShowSuggestion(false);
            const value = String(event.target.value ?? "").trim();
            if (shouldRememberValue && typeof window !== "undefined" && value) {
              window.localStorage.setItem(memoryKey, value);
              setSuggestion(value);
            }
            field.onBlur();
            props.onBlur?.(event);
          }}
          onChange={(event) => {
            field.onChange(event);
            props.onChange?.(event);
          }}
        />
      )}
    />
  );
}
