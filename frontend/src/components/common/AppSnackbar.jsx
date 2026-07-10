import { Alert, Snackbar } from "@mui/material";

import useNotificationStore from "../../store/notificationStore";

function AppSnackbar() {
  const open = useNotificationStore((state) => state.open);

  const message = useNotificationStore((state) => state.message);

  const severity = useNotificationStore((state) => state.severity);

  const hideNotification = useNotificationStore(
    (state) => state.hideNotification,
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hideNotification}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={hideNotification}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
