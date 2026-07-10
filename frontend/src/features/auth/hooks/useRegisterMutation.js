import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";
import useNotificationStore from "../../../store/notificationStore";

function useRegisterMutation(setServerError) {
  const navigate = useNavigate();

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      showNotification({
        message: "Registration successful.",
        severity: "success",
      });
      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: true,
        },
      });
    },

    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Registration failed. Please try again.",
      );

      setServerError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });
}

export default useRegisterMutation;
