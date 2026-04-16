import EastRoundedIcon from "@mui/icons-material/EastRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Stack,
  Typography
} from "@mui/material";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { leadershipMessages, recruiterLogos } from "@/constants/landing";

export function LandingPage() {
  const recruitHighlights = [
    {
      icon: <MilitaryTechOutlinedIcon />,
      title: "99+ Years of Legacy",
      text: "One of India's oldest and most prestigious technical institutions, with a long-standing legacy of excellence."
    },
    {
      icon: <BoltOutlinedIcon />,
      title: "Specialized Domains",
      text: "Strong academic depth across mining, petroleum, energy, earth sciences, analytics, and core engineering."
    },
    {
      icon: <Groups2RoundedIcon />,
      title: "Multi-disciplinary Talent",
      text: "Access students from B.Tech, M.Tech, MBA, M.Sc., M.A., and PhD programs across diverse departments."
    },
    {
      icon: <TrendingUpRoundedIcon />,
      title: "Strong Placements",
      text: "A recruiter-friendly process built to support high-quality campus engagement and repeat hiring relationships."
    }
  ];

  return (
    <Box>
      <PublicNavbar />

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #f4faee 0%, #eef7e7 100%)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(163, 205, 142, 0.18), transparent 20%), linear-gradient(90deg, rgba(255,255,255,0.25), transparent 40%)"
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", py: { xs: 5, md: 8 } }}>
          <Grid container spacing={{ xs: 3, md: 3 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }} className="animate-left">
              <Stack spacing={3.5}>
                <Typography
                  variant="overline"
                  sx={{ color: "primary.main", letterSpacing: "0.12em", fontWeight: 700 }}
                >
                  Career Development Centre Portal
                </Typography>
                <Typography variant="h1" sx={{ color: "primary.dark", maxWidth: 560 }}>
                  Recruit with clarity, speed, and institute-grade credibility
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "1rem", maxWidth: 540, lineHeight: 1.7 }}>
                  A recruiter portal inspired by the Career Development Centre experience: institutional, trustworthy,
                  and built to guide company onboarding, JNF creation, and campus coordination with less friction.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="animate-up delay-1">
                  <Button href="/login" variant="contained" size="large" sx={{ bgcolor: "primary.main", color: "#fff" }}>
                    Portal Login
                  </Button>
                  <Button
                    href="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "primary.main",
                      borderColor: "rgba(31,107,45,0.35)",
                      backgroundColor: "rgba(255,255,255,0.5)",
                      "&:hover": { borderColor: "primary.main", bgcolor: "rgba(31,107,45,0.06)" }
                    }}
                  >
                    Recruit From IIT (ISM)
                  </Button>
                </Stack>
                <Stack spacing={1.1} sx={{ color: "text.primary" }}>
                  {["Structured recruiter onboarding", "Fast JNF drafting", "Transparent CDC communication"].map(
                    (item) => (
                      <Stack key={item} direction="row" spacing={1.2} alignItems="center">
                        <VerifiedRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography>{item}</Typography>
                      </Stack>
                    )
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }} className="animate-up delay-2">
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  width: { xs: "100%", md: "96%" },
                  ml: { md: "auto" },
                  overflow: "hidden",
                  background: "#edf5e7",
                  border: "1px solid rgba(31,107,45,0.08)",
                  boxShadow: "0 14px 32px rgba(20, 44, 23, 0.06)",
                  lineHeight: 0
                }}
              >
                <Box
                  component="img"
                  src="https://www.iitism.ac.in/images/iitism_banner_new.gif"
                  alt="IIT (ISM) Dhanbad campus"
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    maxWidth: "100%",
                    transform: "scale(1.05)",
                    transformOrigin: "center center"
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(20,58,24,0.04))"
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch">
            {leadershipMessages.map((message, index) => (
              <Grid key={message.title} size={{ xs: 12 }} className={`animate-up ${index === 0 ? "delay-1" : "delay-2"}`}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    background: "#fff",
                    border: "1px solid rgba(31,107,45,0.08)",
                    boxShadow: "0 12px 36px rgba(20, 44, 23, 0.05)"
                  }}
                >
                  <Grid
                    container
                    spacing={3}
                    direction={message.accent === "right" ? { xs: "column-reverse", md: "row" } : undefined}
                    alignItems="center"
                  >
                    <Grid size={{ xs: 12, md: 2.3 }}>
                      <Stack spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: { xs: 132, md: 170 },
                            height: { xs: 132, md: 170 },
                            border: "4px solid rgba(31,107,45,0.18)",
                            bgcolor: index === 0 ? "#edf7e3" : "#dff1d8",
                            color: "primary.dark",
                            fontSize: 44,
                            fontWeight: 800
                          }}
                          src={index === 0 ? "/director.jpg" : undefined}
                          alt={index === 0 ? "Director, IIT (ISM) Dhanbad" : message.name}
                        >
                          {index === 0 ? "D" : "P"}
                        </Avatar>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 9.7 }}>
                      <Stack spacing={2}>
                        <Typography variant="h3" sx={{ maxWidth: 900 }}>
                          {message.title}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", maxWidth: 900, fontSize: "1.03rem", lineHeight: 1.95 }}>
                          {message.summary}
                        </Typography>
                        <Typography fontWeight={700} color="primary.main">
                          {message.name}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Stack spacing={1.5} alignItems="center" sx={{ mb: 4.5, textAlign: "center" }}>
            <Typography variant="h2" sx={{ color: "primary.dark", maxWidth: 840 }}>
              Why Recruit at IIT (ISM) Dhanbad?
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760, fontSize: "1.05rem", lineHeight: 1.7 }}>
              Partner with an institution that has been shaping India&apos;s finest engineers, researchers, and leaders
              for nearly a century.
            </Typography>
          </Stack>
          <Grid container spacing={2.5}>
            {recruitHighlights.map((item, index) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }} className={`animate-up delay-${index + 1}`}>
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 3.25 },
                    borderRadius: 3,
                    background: "#fff",
                    border: "1px solid rgba(31,107,45,0.08)",
                    boxShadow: "0 10px 28px rgba(19, 63, 27, 0.05)"
                  }}
                >
                  <Stack spacing={2.2}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "rgba(31,107,45,0.08)",
                        color: "primary.main",
                        "& svg": { fontSize: 34 }
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h5" sx={{ color: "primary.dark", fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {item.text}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: { xs: 7, md: 9 } }}>
          <Typography variant="h2" textAlign="center" sx={{ mb: 1 }}>
            Our Recruiters
          </Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            A visual treatment inspired by the institution sites you shared, adapted for the portal experience.
          </Typography>
          <Grid container spacing={2.2}>
            {recruiterLogos.map((logo) => (
              <Grid key={logo} size={{ xs: 6, md: 3 }} className="animate-up delay-2">
                <Box
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    minHeight: 130,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    border: "1px solid rgba(31,107,45,0.08)",
                    fontSize: { xs: "1.2rem", md: "1.65rem" },
                    fontWeight: 700,
                    color: logo === "Qualcomm" ? "#4363d8" : logo === "NVIDIA" ? "#68a300" : "text.primary"
                  }}
                >
                  {logo}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            bgcolor: "#163b1d",
            color: "#fff"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={1.4}>
                <Typography variant="h3">Ready to build a stronger recruiter experience across every page?</Typography>
                <Typography sx={{ opacity: 0.78 }}>
                  This first pass gives the portal a real institutional landing experience. Once you share more page
                  references, we can carry the same language into dashboard, JNF, preview, and profile flows.
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent={{ md: "flex-end" }}>
                <Button href="/register" variant="contained" color="secondary" endIcon={<EastRoundedIcon />}>
                  Create Recruiter Account
                </Button>
                <Button
                  href="/login"
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}
                >
                  Open Portal Login
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <PublicFooter />
    </Box>
  );
}
