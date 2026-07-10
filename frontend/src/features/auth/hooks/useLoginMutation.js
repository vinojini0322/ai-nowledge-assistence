import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import useAuthStore from "../../../store/authStore";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";
import useNotificationStore from "../../../store/notificationStore";

function useLoginMutation(setServerError) {
  const navigate = useNavigate();
  const location = useLocation();

  const setAuthentication = useAuthStore((state) => state.setAuthentication);

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      setAuthentication({
        accessToken: data.token,
        user: {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      const destination = location.state?.from?.pathname || "/dashboard";

      showNotification({
        message: "Login successful.",
        severity: "success",
      });

      navigate(destination, { replace: true });
    },

    onError: (error) => {
      const message = getApiErrorMessage(error, "Invalid email or password.");

      setServerError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });
}

export default useLoginMutation;
