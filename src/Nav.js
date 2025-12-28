import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
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
  Avatar,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Storefront as StorefrontIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CategoriesMenu from './components/CategoriesMenu';
import { useAuth } from './AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '14px',
  backgroundColor: 'rgba(0,0,0,0.04)',
  border: '1.5px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  '&:focus-within': {
    backgroundColor: 'white',
    border: '1.5px solid var(--primary)',
    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  flex: 1,
  maxWidth: '500px',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#94a3b8'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1e293b',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    fontSize: '0.95rem',
    '&::placeholder': {
      color: '#94a3b8',
      opacity: 1
    }
  },
}));

const PrimarySearchAppBar = () => {
  const { isAuth, loading, logout, setOpenSignIn, setOpenSignUp } = useAuth();
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
      navigate('/my-ads');
    } else if (menuItem === 'Profile') {
      navigate('/profile');
    } else if (menuItem === 'Messages') {
      navigate('/chat');
    } else if (menuItem === 'Favourites') {
      navigate('/favourites');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.04)'
        }}
      >
        <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              px: 2,
              py: 0.75
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                KHARID<span style={{ opacity: 0.8 }}>BECH</span>
              </Typography>
            </Box>
          </Link>

          {/* Search */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for anything..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {!loading && (
              isAuth ? (
                <>
                  {/* Messages */}
                  <IconButton
                    onClick={() => navigate('/chat')}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      color: '#64748b',
                      '&:hover': { color: 'var(--primary)', bgcolor: 'rgba(99, 102, 241, 0.08)' }
                    }}
                  >
                    <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 18, minWidth: 18 } }}>
                      <ChatIcon />
                    </Badge>
                  </IconButton>

                  {/* Favourites */}
                  <IconButton
                    onClick={() => navigate('/favourites')}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      color: '#64748b',
                      '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.08)' }
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>

                  {/* Profile Menu */}
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      p: 0.5,
                      border: '2px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: 'var(--primary)' }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: '16px',
                        minWidth: 200,
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleMenuClick('Profile')} sx={{ py: 1.5 }}>
                      <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
                      <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 500 }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuClick('My Ads')} sx={{ py: 1.5 }}>
                      <ListItemIcon><StorefrontIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
                      <ListItemText primary="My Listings" primaryTypographyProps={{ fontWeight: 500 }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuClick('Messages')} sx={{ py: 1.5, display: { md: 'none' } }}>
                      <ListItemIcon><ChatIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
                      <ListItemText primary="Messages" primaryTypographyProps={{ fontWeight: 500 }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuClick('Favourites')} sx={{ py: 1.5, display: { md: 'none' } }}>
                      <ListItemIcon><FavoriteIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
                      <ListItemText primary="Favourites" primaryTypographyProps={{ fontWeight: 500 }} />
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={() => handleMenuClick('Logout')} sx={{ py: 1.5, color: '#ef4444' }}>
                      <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                      <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
                    </MenuItem>
                  </Menu>

                  {/* Sell Button */}
                  <Link to="/post-ad" style={{ textDecoration: 'none' }}>
                    <Button
                      startIcon={<AddIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        px: { xs: 2, md: 3 },
                        py: 1,
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      {isMobile ? 'Sell' : 'Post Ad'}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setOpenSignIn(true)}
                    sx={{
                      color: '#1e293b',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '12px',
                      px: 2,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSignUp(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      px: { xs: 2, md: 3 },
                      py: 1,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    {isMobile ? 'Sell' : 'Post Ad'}
                  </Button>
                </>
              )
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
