import { Avatar, Box, Divider, Paper, Stack, Typography } from "@mui/material";

import useAuthStore from "../../../store/authStore";

import PropTypes from "prop-types";


function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 3 }}>
        Profile
      </Typography>

      <Paper
        elevation={1}
        sx={{
          maxWidth: 700,
          p: {
            xs: 3,
            sm: 4,
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={3}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 28,
              fontWeight: 700,
              bgcolor: "primary.main",
            }}
          >
            {initials || "U"}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight={700}>
              {fullName || "User"}
            </Typography>

            <Typography color="text.secondary">
              {user?.email || "Email not available"}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2.5}>
          <ProfileField label="First name" value={user?.firstName} />

          <ProfileField label="Last name" value={user?.lastName} />

          <ProfileField label="Email address" value={user?.email} />

          <ProfileField label="User ID" value={user?.id} />
        </Stack>
      </Paper>
    </Box>
  );
}

function ProfileField({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          overflowWrap: "anywhere",
        }}
      >
        {value || "Not available"}
      </Typography>
    </Box>
  );
}

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default ProfilePage;
