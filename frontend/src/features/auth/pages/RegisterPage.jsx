import { useState } from "react";

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
import { Link as RouterLink } from "react-router-dom";

import { registerSchema } from "../validation/authSchemas";
import useRegisterMutation from "../hooks/useRegisterMutation";

function RegisterPage() {
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useRegisterMutation(setServerError);

  const onSubmit = (formData) => {
    setServerError("");

    registerMutation.mutate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Create account
        </Typography>

        <Typography color="text.secondary">
          Register to start using the AI Knowledge Assistant.
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

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First name"
                autoComplete="given-name"
                autoFocus
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
                disabled={registerMutation.isPending}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last name"
                autoComplete="family-name"
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
                disabled={registerMutation.isPending}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email address"
                type="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                disabled={registerMutation.isPending}
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
                autoComplete="new-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                disabled={registerMutation.isPending}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
                disabled={registerMutation.isPending}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create account"
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              fontWeight={600}
            >
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default RegisterPage;
