import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { NavLink, Outlet } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Chat",
    path: "/chat",
  },
  {
    label: "Documents",
    path: "/documents",
  },
  {
    label: "Profile",
    path: "/profile",
  },
];

function AppLayout() {
  const navigate = useNavigate();
  const clearAuthentication = useAuthStore(
    (state) => state.clearAuthentication,
  );

  const handleLogout = () => {
    clearAuthentication();
    navigate("/login", { replace: true });
  };
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
            }}
          >
            AI Knowledge Assistant
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "common.white",

                  "&.active": {
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "common.white",
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth="xl"
        sx={{
          py: 3,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppLayout;
