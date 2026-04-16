"use client";

import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

type Proposal = {
  id: string;
  type: string;
  title: string;
  status: string;
  dateLabel: string;
  date: string;
  action: string;
  href?: string;
};

type Props = {
  title: string;
  proposals: Proposal[];
};

export function ProposalList({ title, proposals }: Props) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight={900} gutterBottom>
          {title}
        </Typography>
        {proposals.length === 0 ? (
          <Typography color="text.secondary">No submissions found yet.</Typography>
        ) : null}
        <Stack spacing={2}>
          {proposals.map((proposal) => (
            <Card key={proposal.id} variant="outlined">
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={2}
                >
                  <div>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Chip label={proposal.type} size="small" variant="outlined" color="primary" />
                      <Chip
                        label={proposal.status}
                        size="small"
                        color={
                          proposal.status === "Accepted"
                            ? "success"
                            : proposal.status === "Open for Edit"
                            ? "info"
                            : "warning"
                        }
                        variant={proposal.status === "Accepted" ? "filled" : "outlined"}
                      />
                    </Stack>
                    <Typography fontWeight={800} mt={1}>
                      {proposal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {proposal.id} | {proposal.dateLabel} {proposal.date}
                    </Typography>
                  </div>
                  <Button href={proposal.href} variant="outlined">
                    {proposal.action}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
