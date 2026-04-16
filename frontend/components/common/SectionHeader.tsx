import { Stack, Typography } from "@mui/material";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: Props) {
  return (
    <Stack spacing={1.2} mb={3}>
      {eyebrow ? (
        <Typography variant="overline" color="primary.main" fontWeight={800}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h3">{title}</Typography>
      {description ? <Typography color="text.secondary">{description}</Typography> : null}
    </Stack>
  );
}
