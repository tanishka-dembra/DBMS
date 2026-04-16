"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  NoSsr,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { dashboardNavItems } from "@/constants/jnf";
import {
  fetchNotifications,
  markAllNotificationsRead as markAllNotificationsReadApi,
  markNotificationRead as markNotificationReadApi,
  NotificationItem
} from "@/services/api/submissions";

const drawerWidth = 280;

type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function DashboardShell({ title, action, children }: Props) {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const router = useRouter();
  const token = session?.user?.apiToken;
  const hasUnreadNotifications = notifications.some((item) => !item.is_read);

  const loadNotifications = async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    setNotifications(await fetchNotifications(token));
  };

  useEffect(() => {
    void loadNotifications();
  }, [token]);

  const markAllNotificationsRead = async () => {
    if (!token) {
      return;
    }

    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
    await markAllNotificationsReadApi(token).catch(() => null);
  };

  const markNotificationRead = async (item: NotificationItem) => {
    if (!token || item.is_read) {
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.notification_id === item.notification_id ? { ...notification, is_read: true } : notification
      )
    );
    await markNotificationReadApi(token, item.notification_id).catch(() => null);
  };

  const navigation = (
    <>
      <Box p={3}>
        <Typography variant="h6" fontWeight={900} color="#ffffff">
          IIT (ISM) JNF Portal
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {dashboardNavItems.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            onClick={() => setDrawerOpen(false)}
            sx={{
              borderRadius: 3,
              mb: 1,
              color: "#ffffff",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)"
              }
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "primary.dark",
            color: "#ffffff"
          }
        }}
      >
        {navigation}
      </Drawer>
      <Drawer
        anchor="right"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 360 },
            boxSizing: "border-box"
          }
        }}
      >
        <Box p={3} borderBottom="1px solid rgba(31, 107, 45, 0.12)">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updates on JNF and INF activity.
              </Typography>
            </Box>
            <Button size="small" onClick={() => void markAllNotificationsRead()}>
              Mark all read
            </Button>
          </Stack>
        </Box>
        <List sx={{ px: 2, py: 1 }}>
          {notifications.length === 0 ? (
            <ListItemText primary="No notifications yet" secondary="New updates will appear here." sx={{ px: 2, py: 1 }} />
          ) : null}
          {notifications.map((item) => (
            <ListItemButton
              key={item.notification_id}
              onClick={() => {
                void markNotificationRead(item);
                const href = notificationHref(item);
                if (href) {
                  setNotificationsOpen(false);
                  router.push(href);
                }
              }}
              sx={{
                mb: 1,
                borderRadius: 3,
                alignItems: "flex-start",
                cursor: notificationHref(item) ? "pointer" : "default"
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                <Badge
                  variant="dot"
                  invisible={item.is_read}
                  color={item.type === "success" ? "success" : item.type === "error" ? "error" : item.type === "warning" ? "warning" : "info"}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary" display="block">
                      {item.message}
                    </Typography>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {formatDateTime(item.created_at)}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{ fontWeight: 700 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" minWidth={0}>
              <NoSsr>
                <IconButton
                  color="inherit"
                  edge="start"
                  aria-label="Open navigation menu"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 0.5 }}
                >
                  <MenuRoundedIcon />
                </IconButton>
              </NoSsr>
              <Stack minWidth={0}>
                <Typography variant="h6" noWrap>
                  {title}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}>
              {action}
              <NoSsr>
                <IconButton
                  color="inherit"
                  aria-label="View notifications"
                  onClick={() => {
                    setNotificationsOpen(true);
                    void loadNotifications();
                  }}
                >
                  <Badge color="error" variant="dot" overlap="circular" invisible={!hasUnreadNotifications}>
                    <NotificationsRoundedIcon />
                  </Badge>
                </IconButton>
              </NoSsr>
              <NoSsr>
                <IconButton color="inherit" onClick={(event) => setAccountMenuAnchor(event.currentTarget)}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {session?.user?.name?.slice(0, 1) || session?.user?.companyName?.slice(0, 1) || "R"}
                  </Avatar>
                </IconButton>
              </NoSsr>
              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={() => setAccountMenuAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAccountMenuAnchor(null);
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAccountMenuAnchor(null);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>
        <Box p={{ xs: 2, md: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
}

function notificationHref(item: NotificationItem) {
  if (item.related_entity === "jnf") {
    return "/dashboard/my-jnfs";
  }

  if (item.related_entity === "inf") {
    return "/dashboard/my-infs";
  }

  if (item.related_entity === "company") {
    return "/dashboard";
  }

  return null;
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
