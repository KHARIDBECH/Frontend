
import React,{useState} from 'react';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';

import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import { Box } from '@mui/material';
import { config } from './Constants';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 export default function SignUp({openSignUp,setopenSignUp}) {
  const url = config.url.API_URL
  const [userData, setuserData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:""
  })  
  const handleClose = () => {
    setopenSignUp(false);
  };
 let name,value;
  const handleInputs = (e)=>{
  console.log(e.target.value);
  name = e.target.name;
  value = e.target.value;
  setuserData({...userData, [name]:value})
  }


  const postData = (e)=>{
    e.preventDefault();
    fetch(`${url}/api/auth/signup`,{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(userData)
    })
    .then(res=>res.json())
    .then((data)=>{
      setopenSignUp(false);
      console.log("signup",data)
    })
    .catch((err)=>{
     console.log(err)
    })
    

  }
  return (
    <div>
      <Dialog
        open={openSignUp}
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
    padding:"50px",
    })}>
        <Avatar sx={(theme) => ({margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main})}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form noValidate onSubmit={postData}>
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
                onChange={handleInputs}
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
                onChange={handleInputs}

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
                onChange={handleInputs}
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
                autoComplete="current-password"
                value={userData.password}
                onChange={handleInputs}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={(theme) => ({margin: theme.spacing(3, 0, 2)})}
            // onClick = {postData}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>

    
      </Dialog>
    </div>
  );
}
