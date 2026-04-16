"use client";

import { useState } from "react";
import { Box, Chip, Stack, TextField } from "@mui/material";

type Props = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function ChipInput({ label, value, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState("");

  const commitValue = () => {
    const next = draft.trim();
    if (!next || value.includes(next)) {
      setDraft("");
      return;
    }

    onChange([...value, next]);
    setDraft("");
  };

  return (
    <Stack spacing={1}>
      <TextField
        label={label}
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            commitValue();
          }
        }}
        onBlur={commitValue}
      />
      <Box display="flex" flexWrap="wrap" gap={1}>
        {value.map((item) => (
          <Chip key={item} label={item} onDelete={() => onChange(value.filter((entry) => entry !== item))} />
        ))}
      </Box>
    </Stack>
  );
}
