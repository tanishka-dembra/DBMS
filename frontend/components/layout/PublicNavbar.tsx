"use client";

import { useState } from "react";
import Link from "next/link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";

const recruiterMenu = [
  { label: "Recruiter Login", href: "/login" },
  { label: "Recruit From IIT (ISM)", href: "/register" }
];

const navItems = [
  { label: "Home", href: "/", icon: <HomeRoundedIcon fontSize="small" /> },
  { label: "About Us", href: "/", icon: <InfoRoundedIcon fontSize="small" /> },
  { label: "Recruiters' Corner", href: "#", icon: <WorkRoundedIcon fontSize="small" />, recruiter: true },
  { label: "Admin Login", href: "/admin/login", icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> }
];

export function PublicNavbar() {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar disableGutters sx={{ minHeight: 76, gap: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                bgcolor: "#fff",
                display: { xs: "none", md: "grid" },
                placeItems: "center",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
            >
              <Box
                component="img"
                src="https://ir.iitism.ac.in/information-portal/lib/email/images/iitism-logo.png"
                alt="IIT (ISM) Dhanbad logo"
                sx={{
                  width: "72%",
                  height: "72%",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={700} sx={{ lineHeight: 1.08, fontSize: { xs: "0.98rem", md: "1.02rem" } }}>
                Career Development Centre
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.82, fontSize: { xs: "0.82rem", md: "0.9rem" } }}>
                IIT (ISM) Dhanbad
              </Typography>
            </Box>
          </Stack>

          <Box flex={1} />

          <Stack direction="row" spacing={0.1} sx={{ display: { xs: "none", lg: "flex" } }}>
            {navItems.map((item) =>
              item.recruiter ? (
                <Box key={item.label}>
                  <Button
                    color="inherit"
                    onClick={(event) => setMenuAnchor(event.currentTarget)}
                    startIcon={item.icon}
                    endIcon={<ExpandMoreRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{ px: 0.95, color: "inherit", fontSize: "0.8rem", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
                  >
                    {item.label}
                  </Button>
                </Box>
              ) : (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{ px: 0.95, color: "inherit", fontSize: "0.8rem", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Stack>

          <Stack direction="row" spacing={0.8} sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              sx={{
                borderRadius: 1.5,
                px: 1.3,
                py: 0.75,
                minHeight: 40,
                fontSize: "0.74rem",
                lineHeight: 1.2,
                bgcolor: "#dcecc7",
                color: "#153b1b",
                "&:hover": { bgcolor: "#bfd8a1" }
              }}
            >
              Recruit From IIT (ISM)
            </Button>
          </Stack>

          <IconButton
            color="inherit"
            sx={{ display: { xs: "inline-flex", lg: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        disableScrollLock
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 260,
            borderRadius: 2,
            p: 1,
            boxShadow: "0 24px 60px rgba(17, 50, 22, 0.18)"
          }
        }}
      >
        {recruiterMenu.map((item) => (
          <MenuItem
            key={item.label}
            component={Link}
            href={item.href}
            onClick={() => setMenuAnchor(null)}
            sx={{ py: 1.25, borderRadius: 1 }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 300, p: 2.5, background: "linear-gradient(180deg, #f8fbf5, #eef7e9)" } }}
      >
        <Stack spacing={1}>
          <Typography variant="h6">Navigation</Typography>
          {navItems.map((item) =>
            item.recruiter ? (
              recruiterMenu.map((entry) => (
                <Button
                  key={entry.label}
                  component={Link}
                  href={entry.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{ justifyContent: "flex-start" }}
                >
                  {entry.label}
                </Button>
              ))
            ) : (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{ justifyContent: "flex-start" }}
              >
                {item.label}
              </Button>
            )
          )}
          <Button component={Link} href="/register" variant="contained" onClick={() => setMobileOpen(false)}>
            Recruit From IIT (ISM)
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
