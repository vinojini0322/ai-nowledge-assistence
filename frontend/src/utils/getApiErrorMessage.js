const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong. Please try again.",
) => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (responseData?.details) {
    return responseData.details;
  }

  if (!error?.response) {
    return "Unable to connect to the server.";
  }

  return fallbackMessage;
};

export default getApiErrorMessage;
