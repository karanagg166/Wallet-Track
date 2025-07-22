'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { LockOpen, Email, Visibility, VisibilityOff,Person  } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import Link from 'next/link';
const schema = z.object({
  name: z.string().min(1,'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'), 
});

type SignupFormInputs = z.infer<typeof schema>;

const SignupPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(schema),
  });
const router=useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
const onSubmit = async (data: SignupFormInputs) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Signup failed');
    } else {
      alert('Signup successful!');
        router.push("/dashboard");
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Something went wrong.');
  }
};


  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 30%, #0f172a 60%, #1e293b 100%)',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{
          scale: 1.03,
          boxShadow: '0 8px 32px 0px #0006',
          transition: { duration: 0.1 },
        }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(30, 41, 59, 0.85)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 20px 40px #0004',
          backdropFilter: 'blur(18px)',
          border: '1.5px solid #222c37',
          zIndex: 1,
        }}
      >
        {/* Logo/Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#38bdf8', boxShadow: '0 0 0 4px #0ea5e9' }}>
            <LockOpen sx={{ color: '#fff', fontSize: 36 }} />
          </Avatar>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: '#e0e7ef', mt: 2, letterSpacing: 1 }}
            gutterBottom
          >
            Create Account
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Sign up for WalletTrack
          </Typography>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Name Field */}
          <TextField
            label="Name"
            variant="filled"
            fullWidth
            type="text"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#38bdf8' }} />
                </InputAdornment>
              ),
              disableUnderline: false,
              sx: { color: '#e0e7ef' },
            }}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            sx={{
              background: 'rgba(15,23,42,0.85)',
              borderRadius: '0.9rem',
              input: { color: '#e0e7ef' },
              label: { color: '#94a3b8' },
              '& .MuiFilledInput-root': {
                borderRadius: '0.9rem',
                background: 'rgba(15,23,42,0.85)',
                boxShadow: errors.name ? '0 0 0 2px #e11d48' : '0 1px 8px #38bdf822',
                transition: 'box-shadow 0.18s',
                '&:hover': {
                  background: 'rgba(30,41,59,0.95)',
                  boxShadow: '0 0 0 2px #38bdf8',
                },
                '&.Mui-focused': {
                  background: 'rgba(30,41,59,1)',
                  boxShadow: '0 0 0 3px #38bdf8',
                },
                '& .MuiFilledInput-input': {
                  color: '#e0e7ef',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#f87171',
                fontWeight: 500,
              },
            }}
          />
          {/* Email Field */}
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#38bdf8' }} />
                </InputAdornment>
              ),
              disableUnderline: false,
              sx: { color: '#e0e7ef' },
            }}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            sx={{
              background: 'rgba(15,23,42,0.85)',
              borderRadius: '0.9rem',
              input: { color: '#e0e7ef' },
              label: { color: '#94a3b8' },
              '& .MuiFilledInput-root': {
                borderRadius: '0.9rem',
                background: 'rgba(15,23,42,0.85)',
                boxShadow: errors.email ? '0 0 0 2px #e11d48' : '0 1px 8px #38bdf822',
                transition: 'box-shadow 0.18s',
                '&:hover': {
                  background: 'rgba(30,41,59,0.95)',
                  boxShadow: '0 0 0 2px #38bdf8',
                },
                '&.Mui-focused': {
                  background: 'rgba(30,41,59,1)',
                  boxShadow: '0 0 0 3px #38bdf8',
                },
                '& .MuiFilledInput-input': {
                  color: '#e0e7ef',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#f87171',
                fontWeight: 500,
              },
            }}
          />
          {/* Password Field */}
          <TextField
            label="Password"
            variant="filled"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpen sx={{ color: '#38bdf8' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <motion.div whileTap={{ rotate: 180 }} style={{ display: 'flex' }}>
                    <IconButton onClick={togglePasswordVisibility} edge="end" tabIndex={-1} sx={{ color: '#38bdf8' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </motion.div>
                </InputAdornment>
              ),
              disableUnderline: false,
              sx: { color: '#e0e7ef' },
            }}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            sx={{
              background: 'rgba(15,23,42,0.85)',
              borderRadius: '0.9rem',
              input: { color: '#e0e7ef' },
              label: { color: '#94a3b8' },
              '& .MuiFilledInput-root': {
                borderRadius: '0.9rem',
                background: 'rgba(15,23,42,0.85)',
                boxShadow: errors.password ? '0 0 0 2px #e11d48' : '0 1px 8px #38bdf822',
                transition: 'box-shadow 0.18s',
                '&:hover': {
                  background: 'rgba(30,41,59,0.95)',
                  boxShadow: '0 0 0 2px #38bdf8',
                },
                '&.Mui-focused': {
                  background: 'rgba(30,41,59,1)',
                  boxShadow: '0 0 0 3px #38bdf8',
                },
                '& .MuiFilledInput-input': {
                  color: '#e0e7ef',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#f87171',
                fontWeight: 500,
              },
            }}
          />
          {/* Remember Me */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -1 }}>
            <FormControlLabel
              control={<Switch checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} sx={{ '& .MuiSwitch-thumb': { bgcolor: '#38bdf8' } }} />}
              label={<span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 15 }}>Remember Me</span>}
              sx={{ ml: 0 }}
            />
            <Link href="/auth/login" style={{ color: '#38bdf8', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>
              Already have an account?
            </Link>
          </Box>
          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.06, boxShadow: '0 0 32px 0px #38bdf8' }}
            whileTap={{ scale: 0.98 }}
            style={{ borderRadius: '0.9rem' }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '0.9rem',
                boxShadow: '0 2px 8px 0px #38bdf8',
                transition: 'background 0.18s, box-shadow 0.18s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
                  boxShadow: '0 4px 16px 0px #38bdf8',
                },
                '&:active': {
                  background: 'linear-gradient(90deg, #0ea5e9, #2563eb)',
                },
              }}
            >
              Sign Up
            </Button>
          </motion.div>
        </form>
        {/* Log In Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 15 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
              Log In
            </Link>
          </span>
        </Box>
      </motion.div>
    </Box>
  );
};

export default SignupPage;
