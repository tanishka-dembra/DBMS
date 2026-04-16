import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import XIcon from "@mui/icons-material/X";
import { Box, Container, Divider, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { quickLinks } from "@/constants/landing";

export function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        background: "linear-gradient(180deg, #12331b 0%, #0e2414 100%)",
        color: "#fff"
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1.2}>
              <Typography variant="h5">Career Development Centre</Typography>
              <Typography sx={{ opacity: 0.78 }}>
                Recruiter-first workflows for company onboarding, JNF submission, and placement coordination at IIT
                (ISM) Dhanbad.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1.2}>
              {quickLinks.map((item) => (
                <Typography key={item} sx={{ opacity: 0.82 }}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Typography variant="h6" gutterBottom>
              Social
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <LinkedInIcon />
              <XIcon />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={1.1}>
              <Typography sx={{ opacity: 0.82 }}>cdc@iitism.ac.in</Typography>
              <Typography sx={{ opacity: 0.82 }}>+91 326 223 5444</Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <PlaceOutlinedIcon sx={{ mt: 0.25, fontSize: 18 }} />
                <Typography sx={{ opacity: 0.82 }}>
                  Career Development Centre, IIT (ISM) Dhanbad, Jharkhand, India
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
        <Typography sx={{ opacity: 0.62 }}>
          Designed for recruiter onboarding, communication clarity, and high-volume campus engagement.
        </Typography>
      </Container>
    </Box>
  );
}
