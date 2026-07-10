import { useState, useEffect } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { loginSchema } from "../validation/authSchemas";
import useLoginMutation from "../hooks/useLoginMutation";

function LoginPage() {
  const location = useLocation();

  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location.pathname, location.state, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation(setServerError);

  const onSubmit = (formData) => {
    setServerError("");

    loginMutation.mutate({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Welcome back
        </Typography>

        <Typography color="text.secondary">
          Sign in to continue to your AI Knowledge Assistant.
        </Typography>
      </Stack>

      {serverError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setServerError("")}
        >
          {serverError}
        </Alert>
      )}
      {location.state?.registrationSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful. You can now sign in.
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email address"
                type="email"
                autoComplete="email"
                autoFocus
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                disabled={loginMutation.isPending}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                disabled={loginMutation.isPending}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don&apos;t have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              fontWeight={600}
            >
              Create account
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default LoginPage;
