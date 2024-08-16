import React, { useEffect, useContext, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { CssTransition } from '@mui/base/Transitions';
import { PopupContext } from '@mui/base/Unstable_Popup';
import Button from '@mui/material/Button';
import { useAuth } from './AuthContext';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
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
const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};


export default function PrimarySearchAppBar({ openSignIn, setopenSignIn, openSignUp, setopenSignUp }) {
  const classes = useStyles;
  const {is_Auth, logout} =useAuth();
  const [isloggedin, setisloggedin] = useState(false)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let history = useNavigate();
  const createHandleMenuClick = (menuItem) => {
    return () => {
      if (menuItem === "Logout") {
        logout()
        setisloggedin(false)
        history('/')
      }
      else if (menuItem === "Ads") {
        history('/myads')
      }
    };

  };

  
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, height: '100%' }}>
            <Link to="/">
              <img className="header-logo" src="../appLogo.png" alt="logo" style={{ height: '80px', minWidth: '60px' }} />
            </Link>
          </Box>
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
          {isloggedin ?
            <>
              <Dropdown>
                <MenuButton sx={{ backgroundColor: 'primary.main', color: 'white', border: "none", '&:hover': { backgroundColor: 'primary.dark' } }}><AccountCircle /></MenuButton>
                <Menu slots={{ listbox: AnimatedListbox }}>
                  <MenuItem onClick={createHandleMenuClick('Profile')}>Profile</MenuItem>
                  <MenuItem onClick={createHandleMenuClick('Ads')}>
                    My Ads
                  </MenuItem>
                  <MenuItem onClick={createHandleMenuClick('Logout')}>Log out</MenuItem>
                </Menu>
              </Dropdown>
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
            : <>
              <Typography onClick={setModalSignIn} sx={{cursor:"pointer"}}>
                Login
              </Typography>
              <Button
                color="secondary"
                onClick={setModalSignUp}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  fontFamily: 'sans-serif',
                  background: "#32cb86e0",
                  fontWeight: "600",
                  borderRadius: "20px 20px 20px 20px", marginLeft: { xs: '25px' }
                }}
              >Sell</Button></>
          }

        </Toolbar>
      </AppBar>
      <SignIn openSignIn={openSignIn} setopenSignIn={setopenSignIn} setisloggedin={setisloggedin} />
      <SignUp openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
    </Box>
  );
}


const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
};



const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  z-index: 1;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `,
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
    );
  }

  const verticalPlacement = popupContext.placement.split('-')[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

AnimatedListbox.propTypes = {
  ownerState: PropTypes.object.isRequired,
};

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${menuItemClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[50]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }
  `,
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }

  &:active {
    background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }
  `,
);