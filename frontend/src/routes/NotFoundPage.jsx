import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Typography variant="h2">404</Typography>

      <Typography variant="h5">Page not found</Typography>

      <Button component={Link} to="/" variant="contained">
        Go to home
      </Button>
    </Stack>
  );
}

export default NotFoundPage;
