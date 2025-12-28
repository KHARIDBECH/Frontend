import React, { useState } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  InputBase,
  Button,
  Typography,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle, Add as AddIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CategoriesMenu from './components/CategoriesMenu';
import { useAuth } from './AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: { width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' },
  },
}));

const PrimarySearchAppBar = () => {
  const { isAuth, logout, setOpenSignIn, setOpenSignUp } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleMenuClick = (menuItem) => {
    handleMenuClose();
    if (menuItem === 'Logout') {
      logout();
      navigate('/');
    } else if (menuItem === 'My Ads') {
      navigate('/myads');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="glass-nav">
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', color: 'var(--text-main)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: '24px' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '-1px' }}>
                KHARID<span style={{ color: 'var(--secondary)' }}>BECH</span>
              </Typography>
            </Link>
          </Box>

          {!isMobile && (
            <Search sx={{
              backgroundColor: 'rgba(0,0,0,0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.07)' }
            }}>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: 'var(--text-muted)' }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                inputProps={{ 'aria-label': 'search' }}
                sx={{ width: '400px' }}
              />
            </Search>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuth ? (
              <>
                <IconButton color="inherit" onClick={handleMenuOpen} sx={{ p: 0.5, border: '2px solid transparent', '&:hover': { borderColor: 'var(--primary)' } }}>
                  <AccountCircle fontSize="large" sx={{ color: 'var(--text-muted)' }} />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <MenuItem onClick={() => handleMenuClick('Profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => handleMenuClick('My Ads')}>My Ads</MenuItem>
                  <MenuItem onClick={() => handleMenuClick('Logout')}>Logout</MenuItem>
                </Menu>
                <Link to="/Product" style={{ textDecoration: 'none' }}>
                  <Button
                    className="btn-primary"
                    startIcon={<AddIcon />}
                  >
                    Sell
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setOpenSignIn(true)}
                  sx={{ color: 'var(--text-main)', fontWeight: 600, textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button
                  className="btn-primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenSignUp(true)}
                >
                  Sell
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <CategoriesMenu />
      <SignIn />
      <SignUp />
    </Box>
  );
};

export default PrimarySearchAppBar;
