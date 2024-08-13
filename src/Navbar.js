import React, { useEffect, useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';

import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";
import SignIn from './SignIn';
import SignUp from './SignUp';
import { Avatar } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddIcon from '@mui/icons-material/Add';

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



const HeaderNav = ({ setisloggedin }) => {
  const classes = useStyles;
  let history = useHistory();
  const logout = () => {
    Cookies.remove('isAuth');
    Cookies.remove('Token');
    setisloggedin(false)
    history.push('/')


  }
  return (
    <>
    <Box sx={classes.headerNav}>
    
      <IconButton sx={classes.headerOption}>
        <ChatBubbleOutlineIcon />
      </IconButton>
      <IconButton sx={classes.headerOption}>
        <Avatar alt="Remy Sharp" src="/broken-image.jpg" sx={{ bgcolor: 'orange' }} />
      </IconButton>
      <Box sx={classes.headerOption} onClick={logout}>
        Logout
      </Box>
      <Link to="/postad" style={classes.link}>
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
    </Box>
    </>
  );
};



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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar({ openSignIn, setopenSignIn, openSignUp, setopenSignUp }) {
  const theme = useTheme();
  const classes = useStyles;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [is_Auth, setAuth] = useContext(AuthContext);
  const [isloggedin, setisloggedin] = useState(false)


  useEffect(() => {
    if (is_Auth == "true") {
      setisloggedin(true)
    }
  }, [])
  const setModalSignIn = () => {
    setopenSignIn(true)

  }

  const setModalSignUp = () => {
    setopenSignUp(true)
  }


  return (
    <AppBar position="static" sx={{ backgroundColor: '#bb0467' }}>
      <Toolbar>
        {isMobile&& (<IconButton edge="start" color="inherit" aria-label="menu" >
          <MenuIcon />
        </IconButton>)
}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, height: '100%' }}>
          <Link to="/">

            <img className="header-logo" src="../appLogo.png" alt="logo" style={{ height: '80px', width: "100%" }} />
          </Link>
        </Box>
        {!isMobile && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        )}

        {
          isloggedin ? (<HeaderNav setisloggedin={setisloggedin} />) : (<><Button color="inherit" onClick={setModalSignIn} sx={{ mr: 2 }}>Login</Button>
            <Button
              color="secondary"
              onClick={setModalSignUp}
              variant="contained"
              startIcon={<AddIcon />}
              sx={classes.button}
            >Sell</Button></>)
        }
      </Toolbar>
      <SignIn openSignIn={openSignIn} setopenSignIn={setopenSignIn} setisloggedin={setisloggedin} />
      <SignUp openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
    </AppBar>
  );
}
