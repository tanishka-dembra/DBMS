"use client";

import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
};

export function RichTextEditor({ label, value, onChange, minHeight = 160 }: Props) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (!isFocused && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, isFocused]);

  const exec = (command: string, extra?: string) => {
    document.execCommand(command, false, extra);
  };

  if (!mounted) {
    return (
      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={700}>
          {label}
        </Typography>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              minHeight,
              p: 2,
              outline: "none",
              direction: "ltr",
              textAlign: "left",
              unicodeBidi: "isolate",
              writingMode: "horizontal-tb"
            }}
          />
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={700}>
        {label}
      </Typography>
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Stack direction="row" spacing={0.5} sx={{ p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
          <IconButton aria-label="Bold" size="small" onClick={() => exec("bold")}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Italic" size="small" onClick={() => exec("italic")}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Bulleted list" size="small" onClick={() => exec("insertUnorderedList")}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Insert link"
            size="small"
            onClick={() => {
              const url = window.prompt("Enter URL");
              if (url) {
                exec("createLink", url);
              }
            }}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Box
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          dir="ltr"
          ref={editorRef}
          onFocus={() => setIsFocused(true)}
          onBlur={(event) => {
            setIsFocused(false);
            onChange(event.currentTarget.innerHTML);
          }}
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          sx={{
            minHeight,
            p: 2,
            outline: "none",
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "isolate",
            writingMode: "horizontal-tb"
          }}
        />
      </Paper>
    </Stack>
  );
}
