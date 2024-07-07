import React, { useEffect, useContext, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Button from '@mui/material/Button';
import { AuthContext } from './AuthContext';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));
const useStyles = {
    headerNav: {
      display: 'flex',
      alignItems: 'center',
    },
    headerOption: {
      margin: '0 10px',
      cursor: 'pointer'
    },
    button: {
      fontFamily: 'sans-serif',
      background: "#32cb86e0",
      fontWeight: "600",
      borderRadius: "20px 20px 20px 20px"
    },
    link: {
      textDecoration: 'none',
    },
  };
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



export default function PrimarySearchAppBar({openSignIn, setopenSignIn, openSignUp,setopenSignUp }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles;
  const [is_Auth, setAuth] = useContext(AuthContext);
  const [isloggedin, setisloggedin] = useState(false)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    if (is_Auth == "true") {
      setisloggedin(true)
    }
  }, [])
  const setModalSignIn = () => {
    setopenSignIn(true)

  }

  let history = useHistory();
  const logout = () => {
    handleMenuClose()
    Cookies.remove('isAuth');
    Cookies.remove('Token');
    setisloggedin(false)
    history.push('/')


  }

  const setModalSignUp = () => {
    setopenSignUp(true)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
      {isloggedin?<MenuItem onClick={logout}>Logout</MenuItem>:<MenuItem onClick={setModalSignIn} >Login</MenuItem>}
      
      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          > */}
            {/* <MenuIcon />
          </IconButton> */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, height: '100%' }}>
          <Link to="/">

            <img className="header-logo" src="../appLogo.png" alt="logo" style={{ height: '80px',  minWidth: '60px' }} />
          </Link>
        </Box>
          {/* <Typography
            variant="h6"
            component="div"
            // sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography> */}
          {!isMobile && <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
}
          <Box sx={{ flexGrow: 1 }} />
          {isloggedin?
          <>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            
          </Box>
          <Link to="/ad" style={classes.link}>
          <Box sx={classes.headerOption}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={classes.button}
            >
              SELL
            </Button>
          </Box>
        </Link>
        </>
          :<>
          {!isMobile &&<MenuItem onClick={setModalSignIn}>Login</MenuItem>}
            <Button
              color="secondary"
              onClick={setModalSignUp}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{fontFamily: 'sans-serif',
              background: "#32cb86e0",
              fontWeight: "600",
              borderRadius: "20px 20px 20px 20px",marginLeft:{xs:'25px'}}}
            >Sell</Button></>
}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
        <SignIn openSignIn={openSignIn} setopenSignIn={setopenSignIn} setisloggedin={setisloggedin} />
      <SignUp openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
    </Box>
  );
}