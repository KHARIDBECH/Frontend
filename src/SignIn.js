import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Cookies from 'js-cookie'
import { AuthContext } from './AuthContext';
import { config } from './Constants'
import { Box } from '@mui/material';
import { styled } from '@mui/system';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const SignInForm = styled('form')({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  minHeight: "330px",
  
});
export default function SignIn({ openSignIn, setopenSignIn, setisloggedin }) {
  const url = config.url.API_URL
  // const url = "http://localhost:5000"
  const [userData, setuserData] = useState({
    email: "",
    password: ""
  })

  const [isAuth, setAuth] = useContext(AuthContext);
  const [userId, setuserId] = useContext(AuthContext);
  const handleClose = (e) => {
    setopenSignIn(false);
  };
  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;
    setuserData({ ...userData, [name]: value });
  }
  const postData = (e) => {
    e.preventDefault();
    fetch(`${url}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
      .then(response => {
        if (response.status === 401) {
          throw Error(response.statusText);
        }

        return response.json();
      }
      )
      .then((data) => {
        setopenSignIn(false);
        setisloggedin(true)
        Cookies.set("Token", data.token);
        Cookies.set("isAuth", true)
        Cookies.set("userId", data.userId);

      })
      .catch((err) => {
        console.log("err", err)
      })


  }
  return (
    <Box>
      <Dialog
        open={openSignIn}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >

        <Box sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: "25px",
        })}>
          <Avatar sx={(theme) => ({
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
          })}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <SignInForm onSubmit={postData} sx={{  minWidth: { xs: '230px', md: '300px' },}}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="signinEmail"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="signinPassword"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={(theme) => ({ margin: theme.spacing(3, 0, 2) })}
            >
              Sign In
            </Button>
            <Grid container sx={{
              flexDirection: "column",
              alignItems: "center"
            }}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?&nbsp;
                </Link>
              </Grid>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => { console.log("I am emptyy lol........") }}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </SignInForm>
        </Box>
      </Dialog >
    </Box >
  );
}
