"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOpen, Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login failed");
      } else {
        alert("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #3b82f6, #9333ea)", // blue to purple gradient
        padding: 2,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2.5rem",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <LockOpen
            sx={{ fontSize: 48, color: "#3b82f6", marginBottom: "0.5rem" }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            color="textPrimary"
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Log in to your WalletTrack account
          </Typography>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Email Field */}
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#3b82f6" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpen sx={{ color: "#3b82f6" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#2563eb" },
            }}
          >
            Log In
          </Button>
        </form>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
