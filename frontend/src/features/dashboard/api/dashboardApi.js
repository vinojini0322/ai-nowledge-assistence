import apiClient from "../../../api/apiClient";

export const getDashboardSummary = async () => {
  const response = await apiClient.get("/dashboard");
  return response.data;
};
