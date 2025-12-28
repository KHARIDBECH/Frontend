import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  Dialog,
  Slide,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../src/AuthContext';
import { config } from './Constants';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const SignInForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  minHeight: '330px',
  width: '100%',
  maxWidth: '400px',
  padding: theme.spacing(3),
}));

const SignIn = () => {
  const { openSignIn, setOpenSignIn, setOpenSignUp, login } = useAuth();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const url = config.url.API_URL;

  const validateForm = () => {
    const newErrors = {};
    if (!userData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Email is invalid';
    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 4) newErrors.password = 'Password must be at least 4 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => setOpenSignIn(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${url}/api/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Incorrect email or password' : 'An error occurred');
      }

      const data = await response.json();
      login(data.token, data.userId);
      setOpenSignIn(false);
      setApiError('');
      setSuccessMessage('Sign in successful!');
      setSnackbarSeverity('success');
    } catch (err) {
      console.error('Sign in error:', err);
      setApiError(err.message);
      setSuccessMessage('');
      setSnackbarSeverity('error');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSuccessMessage('');
    setApiError('');
  };

  return (
    <>
      <Dialog
        open={openSignIn}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            padding: '12px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: (theme) => theme.spacing(3),
        }}>
          <Avatar sx={(theme) => ({
            margin: theme.spacing(2),
            backgroundColor: 'var(--primary)',
            width: 56,
            height: 56
          })}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 3 }}>
            Sign in to continue to KharidBech
          </Typography>
          <SignInForm onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="signinEmail"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={userData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="signinPassword"
              autoComplete="current-password"
              value={userData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            {apiError && (
              <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: '12px' }}>
                {apiError}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="btn-primary"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
            >
              Sign In
            </Button>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setOpenSignUp(true);
                    setOpenSignIn(false);
                  }}
                  sx={{ fontWeight: 600, color: 'var(--primary)' }}
                >
                  Don't have an account? Create one
                </Link>
              </Grid>
            </Grid>
          </SignInForm>
        </Box>
      </Dialog>
      <Snackbar
        open={!!successMessage || !!apiError}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '12px' }} variant="filled">
          {successMessage || apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignIn;

