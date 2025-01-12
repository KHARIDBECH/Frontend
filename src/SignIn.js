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

const SignIn = ({ openSignIn, setopenSignIn, setIsLoggedIn, setopenSignUp }) => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { login } = useAuth();
  const url = config.url.API_URL;

  const validateForm = () => {
    const newErrors = {};
    if (!userData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Email is invalid';
    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 4) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => setopenSignIn(false);

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
      setopenSignIn(false);
      setIsLoggedIn(true);
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
    if (reason === 'clickaway') {
      return;
    }
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
        aria-labelledby="sign-in-dialog-title"
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: (theme) => theme.spacing(3),
        }}>
          <Avatar sx={(theme) => ({
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
          })}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            />
            {apiError && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {apiError}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={(theme) => ({ margin: theme.spacing(3, 0, 2) })}
            >
              Sign In
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link href="#" variant="body2" onClick={() => { 
                  setopenSignUp(true)
                  setopenSignIn(false)
                  }}>
                  Don't have an account? Sign Up
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {successMessage || apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignIn;

