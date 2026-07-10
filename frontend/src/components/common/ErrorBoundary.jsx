import React from "react";
import PropTypes from "prop-types";

import { Box, Button, Paper, Typography } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error(errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            bgcolor: "background.default",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Oops!
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Something went wrong while rendering the application.
            </Typography>

            <Button variant="contained" onClick={this.handleReload}>
              Reload Application
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
