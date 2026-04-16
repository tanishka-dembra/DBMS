import { Box, Container } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export function PageContainer({ children }: Props) {
  return (
    <Container maxWidth="xl">
      <Box py={{ xs: 3, md: 5 }}>{children}</Box>
    </Container>
  );
}
