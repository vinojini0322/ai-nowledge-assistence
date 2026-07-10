import PropTypes from "prop-types";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";

import queryClient from "./queryClient";
import theme from "../theme/theme";
import AppSnackbar from "../components/common/AppSnackbar";

function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}

        <AppSnackbar />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
