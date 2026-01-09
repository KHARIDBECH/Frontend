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
  Snackbar,
  IconButton,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from './AuthContext';
import { config } from './Constants';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const SignInForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px',
  padding: theme.spacing(3),
}));

const SignIn = () => {
  const { openSignIn, setOpenSignIn, setOpenSignUp } = useAuth();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const checkRes = await fetch(`${config.url.API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` }
      });
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.data) {
        setOpenSignIn(false);
        setSuccessMessage('Welcome back!');
        setSnackbarSeverity('success');
      } else {
        const nameParts = user.displayName ? user.displayName.split(' ') : ['User', ''];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'User';
        const idToken = await user.getIdToken();

        const registrationData = {
          firstName,
          lastName,
          gender: 'Other',
          address: '',
          profilePic: user.photoURL || ''
        };

        const regRes = await fetch(`${config.url.API_URL}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(registrationData),
        });

        if (regRes.ok) {
          setOpenSignIn(false);
          setSuccessMessage('Welcome to KharidBech!');
          setSnackbarSeverity('success');
        } else {
          const errorData = await regRes.json();
          throw new Error(errorData.error || 'Failed to register with Google.');
        }
      }
    } catch (err) {
      console.error('Google Sign In error:', err);
      setApiError(err.message);
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      setOpenSignIn(false);
      setApiError('');
      setSuccessMessage('Sign in successful!');
      setSnackbarSeverity('success');
    } catch (err) {
      console.error('Sign in error:', err);
      setApiError('Invalid email or password');
      setSuccessMessage('');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
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
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            maxWidth: '420px',
            width: '100%',
            m: 2
          }
        }}
      >
        {/* Gradient Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 4,
          pb: 6,
          position: 'relative',
          textAlign: 'center'
        }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Avatar sx={{
            mx: 'auto',
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 64,
            height: 64
          }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
            Sign in to continue to KharidBech
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 4, pt: 3, mt: -3, bgcolor: 'white', borderRadius: '24px 24px 0 0' }}>
          <SignInForm onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="signinEmail"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={userData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="signinPassword"
              autoComplete="current-password"
              value={userData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />

            {apiError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                {apiError}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                py: 1.5,
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 25px -5px rgba(99, 102, 241, 0.5)',
                },
                '&:disabled': {
                  background: '#cbd5e1',
                  color: 'white'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#e2e8f0' }} />
              <Typography variant="body2" sx={{ px: 2, color: '#94a3b8', fontWeight: 500 }}>
                or continue with
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#e2e8f0' }} />
            </Box>

            <Button
              fullWidth
              onClick={handleGoogleSignIn}
              disabled={loading}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                borderRadius: '14px',
                textTransform: 'none',
                fontWeight: 600,
                color: '#1e293b',
                bgcolor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                  borderColor: '#667eea',
                  color: '#667eea'
                }
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Don't have an account?{' '}
                <Link
                  component="button"
                  onClick={() => {
                    setOpenSignUp(true);
                    setOpenSignIn(false);
                  }}
                  sx={{
                    fontWeight: 600,
                    color: '#667eea',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Create one
                </Link>
              </Typography>
            </Box>
          </SignInForm>
        </Box>
      </Dialog>

      <Snackbar
        open={!!successMessage || !!apiError}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%', borderRadius: '14px' }}
          variant="filled"
        >
          {successMessage || apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignIn;
