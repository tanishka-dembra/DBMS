"use client";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, Stack, Typography } from "@mui/material";
import { useRef } from "react";

type Props = {
  label: string;
  value?: string;
  accept?: string;
  onChange: (filename: string) => void;
};

export function FileUploadField({ label, value, accept, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={700}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
          Upload file
          <input
            ref={inputRef}
            hidden
            type="file"
            accept={accept}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onChange(file.name);
              }
            }}
          />
        </Button>
        <Button
          variant="text"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          disabled={!value}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            onChange("");
          }}
        >
          Remove
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {value || "No file selected"}
      </Typography>
    </Stack>
  );
}
