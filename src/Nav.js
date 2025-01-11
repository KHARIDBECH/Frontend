import React, { useEffect, useState, useContext } from 'react';
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
import PropTypes from 'prop-types';
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

const PrimarySearchAppBar = ({ openSignIn, setopenSignIn, openSignUp, setopenSignUp }) => {
  const { isAuth, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoggedIn(isAuth === true);
  }, [isAuth]);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleMenuClick = (menuItem) => {
    handleMenuClose();
    if (menuItem === 'Logout') {
      logout();
      setIsLoggedIn(false);
      navigate('/');
    } else if (menuItem === 'My Ads') {
      navigate('/myads');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <img src="../appLogo.png" alt="Logo" style={{ height: '50px' }} />
          </Link>
          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {isLoggedIn ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleMenuClick('Profile')}>Profile</MenuItem>
                <MenuItem onClick={() => handleMenuClick('My Ads')}>My Ads</MenuItem>
                <MenuItem onClick={() => handleMenuClick('Logout')}>Logout</MenuItem>
              </Menu>
              <Link to="/Product" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  sx={{
                    fontWeight: 600,
                    borderRadius: '20px',
                    marginLeft: theme.spacing(2),
                  }}
                >
                  Sell
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Typography
                sx={{ cursor: 'pointer', marginRight: theme.spacing(2) }}
                onClick={() => setopenSignIn(true)}
              >
                Login
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => setopenSignUp(true)}
                sx={{
                  fontWeight: 600,
                  borderRadius: '20px',
                }}
              >
                Sell
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <CategoriesMenu />
      <SignIn openSignIn={openSignIn} setopenSignIn={setopenSignIn} setIsLoggedIn={setIsLoggedIn} />
      <SignUp openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
    </Box>
  );
};

PrimarySearchAppBar.propTypes = {
  openSignIn: PropTypes.bool.isRequired,
  setopenSignIn: PropTypes.func.isRequired,
  openSignUp: PropTypes.bool.isRequired,
  setopenSignUp: PropTypes.func.isRequired,
};

export default PrimarySearchAppBar;
