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

const SignUp = ({ openSignUp, setopenSignUp, setopenSignIn}) => {
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
    else if (userData.password.length < 4) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => setopenSignUp(false);

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
        if (response.status === 400) {
          throw new Error('This email address is already registered.');
        } else {
          throw new Error('An error occurred during sign up.');
        }
      }

      await response.json();
      setSuccessMessage('Sign up successful! You can now log in.');
      setSnackbarSeverity('success');
      setTimeout(() => {
        setopenSignUp(false);
        setSuccessMessage('');
      }, 3000);
      setApiError('');
    } catch (err) {
      console.error('Sign up error:', err);
      setApiError(err.message);
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
        open={openSignUp}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="sign-up-dialog-title"
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: (theme) => theme.spacing(4),
        }}>
          <Avatar sx={(theme) => ({
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
          })}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
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
                />
              </Grid>
            </Grid>
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
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => { 
                  setopenSignIn(true)
                  setopenSignUp(false)
                  }}>
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {successMessage || apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignUp;

