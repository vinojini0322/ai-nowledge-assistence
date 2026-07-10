import { Box, Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthLayout;
