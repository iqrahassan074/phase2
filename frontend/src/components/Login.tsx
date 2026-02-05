import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api/api';
import { useNavigate } from 'react-router-dom';

interface LoginFormInputs {
  username: string; // Using username for OAuth2PasswordRequestForm
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);


  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setErrorMessage(null); // Clear previous errors
      const response = await apiCall<{ access_token: string, token_type: string }>('/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: data.username,
          password: data.password,
        }).toString(),
      });
      // In a real app, you'd decode the token to get user info or make another API call
      // For now, let's assume a dummy user object or extract from token if possible
      const dummyUser = { email: data.username }; // Placeholder user info
      login(response.access_token, dummyUser);
      navigate('/tasks');
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed');
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
          Sign In
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
            id="username"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('username', { required: 'Email is required' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
