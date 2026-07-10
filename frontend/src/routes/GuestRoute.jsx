import { Navigate, Outlet } from "react-router-dom";

import useAuthStore from "../store/authStore";

function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
