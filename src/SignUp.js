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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { config } from './Constants';
import { useAuth } from './AuthContext';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const SignUpForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  width: '100%',
  maxWidth: '600px',
  padding: theme.spacing(3),
}));


const SignUp = () => {
  const { openSignUp, setOpenSignUp, setOpenSignIn } = useAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const url = config.url.API_URL;

  const validateForm = () => {
    const newErrors = {};
    if (!userData.firstName) newErrors.firstName = 'First name is required';
    if (!userData.lastName) newErrors.lastName = 'Last name is required';
    if (!userData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Email is invalid';
    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 4) newErrors.password = 'Password must be at least 4 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => setOpenSignUp(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${url}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred during sign up.');
      }

      await response.json();
      setSuccessMessage('Sign up successful! You can now log in.');
      setSnackbarSeverity('success');
      setTimeout(() => {
        setOpenSignUp(false);
        setSuccessMessage('');
        setOpenSignIn(true);
      }, 2000);
      setApiError('');
    } catch (err) {
      console.error('Sign up error:', err);
      setApiError(err.message);
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
        open={openSignUp}
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
            backgroundColor: 'var(--secondary)',
            width: 56,
            height: 56
          })}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 3 }}>
            Join KharidBech and start selling today
          </Typography>
          <SignUpForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={userData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={userData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="signupEmail"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={userData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="signupPassword"
                  autoComplete="new-password"
                  value={userData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
            </Grid>
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
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', backgroundColor: 'var(--secondary)' }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center" sx={{ mt: 1 }}>
              <Grid item>
                <Link component="button" variant="body2" onClick={() => {
                  setOpenSignIn(true);
                  setOpenSignUp(false);
                }} sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </SignUpForm>
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

export default SignUp;

