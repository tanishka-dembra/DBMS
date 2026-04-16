"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6b2d",
      light: "#3f8a4c",
      dark: "#123f1b",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#dcecc7",
      dark: "#bfd8a1",
      contrastText: "#153b1b"
    },
    background: {
      default: "#f2f7ef",
      paper: "#ffffff"
    },
    text: {
      primary: "#19311d",
      secondary: "#58705c"
    },
    success: { main: "#1f8a3f" }
  },
  typography: {
    fontFamily: "\"Poppins\", \"Trebuchet MS\", \"Segoe UI\", sans-serif",
    h1: {
      fontSize: "2.55rem",
      fontWeight: 800,
      lineHeight: 1.18,
      letterSpacing: "-0.03em"
    },
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.02em"
    },
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em"
    },
    h4: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textTransform: "none"
    }
  },
  shape: {
    borderRadius: 14
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(18, 63, 27, 0.95)",
          color: "#ffffff",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 48,
          paddingInline: 22
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(31, 107, 45, 0.08)",
          boxShadow: "0 22px 60px rgba(22, 58, 24, 0.08)"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 10
        },
        notchedOutline: {
          borderColor: "rgba(25, 49, 29, 0.12)"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    }
  }
});
