import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api/api';
import { useNavigate } from 'react-router-dom';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register: registerForm, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);


  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setErrorMessage(null); // Clear previous errors
      const response = await apiCall<{ access_token: string, token_type: string }>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // In a real app, you'd decode the token to get user info or make another API call
      // For now, let's assume a dummy user object or extract from token if possible
      const dummyUser = { email: data.email, name: data.name }; // Placeholder user info
      registerAuth(response.access_token, dummyUser);
      navigate('/tasks');
    } catch (error: any) {
      setErrorMessage(error.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            autoComplete="name"
            autoFocus
            {...registerForm('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...registerForm('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            {...registerForm('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
