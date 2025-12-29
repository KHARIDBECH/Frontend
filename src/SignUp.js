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
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import { config } from './Constants';
import { useAuth } from './AuthContext';
import { auth, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const SignUpForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: theme.spacing(3),
}));

const SignUp = () => {
  const { openSignUp, setOpenSignUp, setOpenSignIn } = useAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = config.url.API_URL;

  const validateForm = () => {
    const newErrors = {};
    if (!userData.firstName) newErrors.firstName = 'First name is required';
    if (!userData.lastName) newErrors.lastName = 'Last name is required';
    if (!userData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Email is invalid';
    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setOpenSignUp(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const checkRes = await fetch(`${url}/api/users/me`, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` }
      });
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.data) {
        setSuccessMessage('Welcome back!');
        setSnackbarSeverity('success');
        setTimeout(() => handleClose(), 1500);
        return;
      }

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

      const response = await fetch(`${url}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync with database.');
      }

      setSuccessMessage('Welcome to KharidBech!');
      setSnackbarSeverity('success');
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      console.error('Google Sign Up error:', err);
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
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      const idToken = await user.getIdToken();
      const registrationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender || 'Other',
        address: userData.address || '',
        profilePic: ''
      };

      const response = await fetch(`${url}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Account created but failed to sync with database.');
      }

      setSuccessMessage('Account created successfully!');
      setSnackbarSeverity('success');
      setTimeout(() => {
        setOpenSignUp(false);
      }, 1500);
      setApiError('');
    } catch (err) {
      console.error('Sign up error:', err);
      setApiError(err.message);
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
        open={openSignUp}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        scroll="body"
        PaperProps={{
          sx: {
            borderRadius: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            maxWidth: '480px',
            width: '100%',
            m: { xs: 2, md: 3 },
            position: 'relative'
          }
        }}
      >
        {/* Gradient Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: { xs: 3, md: 4 },
          pb: { xs: 5, md: 6 },
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
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
            Join KharidBech and start trading today
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: { xs: 3, md: 4 }, pt: 3, mt: -3, bgcolor: 'white', borderRadius: '24px 24px 0 0' }}>
          <SignUpForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={userData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={userData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={userData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94a3b8' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={userData.gender}
                    label="Gender"
                    onChange={handleChange}
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="address"
                  label="City (Optional)"
                  value={userData.address}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
            </Grid>

            {apiError && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
                {apiError}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                py: 1.5,
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.4)',
                '&:hover': { boxShadow: '0 12px 25px -5px rgba(99, 102, 241, 0.5)' },
                '&:disabled': { background: '#cbd5e1', color: 'white' }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#e2e8f0' }} />
              <Typography variant="body2" sx={{ px: 2, color: '#94a3b8', fontWeight: 500 }}>
                or
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#e2e8f0' }} />
            </Box>

            <Button
              fullWidth
              onClick={handleGoogleSignUp}
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
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#667eea', color: '#667eea' }
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Already have an account?{' '}
                <Link
                  component="button"
                  onClick={() => { setOpenSignIn(true); setOpenSignUp(false); }}
                  sx={{ fontWeight: 600, color: '#667eea', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </SignUpForm>
        </Box>
      </Dialog>

      <Snackbar
        open={!!successMessage || !!apiError}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '14px' }} variant="filled">
          {successMessage || apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignUp;
