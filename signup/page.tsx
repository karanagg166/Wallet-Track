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
} from '@mui/material';
import { LockOpen, Email, Visibility, VisibilityOff,Person  } from '@mui/icons-material';
import { motion } from 'framer-motion';

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

  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data: SignupFormInputs) => {
    console.log('Login Data:', data);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,rgb(121, 140, 225) 10%,rgb(185, 116, 235) 100%)',
        padding: 2,
        fontFamily: "'Libertinus Math', serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{
          scale: 1.08,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          transition: { duration: 0.2 },
        }}
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          fontFamily: "'Libertinus Math', serif",
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', }}>
          <LockOpen fontSize="large" color="primary" />
          <Typography variant="h4" fontWeight="bold" color="textPrimary">
            Elcome Back
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Login to continue
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
           <TextField
  label="Name"
  variant="outlined"
  fullWidth
  type="text"
  {...register('name')}
  error={!!errors.name}
  helperText={errors.name?.message}
  sx={{
    '& .MuiOutlinedInput-root': {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1976d2', // Change border color on hover
      },
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Person color="primary" />
      </InputAdornment>
    ),
  }}
/>


          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            {...register('email')}
            error={!!errors.email}
            sx={{
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2',
    },
      }}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
             sx={{
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2',
    },
  }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpen color="primary" />
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#1976d2', fontWeight: 'bold' }}
          >
            Log In
          </Button>
        </form>
      </motion.div>
    </Box>
  );
};

export default SignupPage;
