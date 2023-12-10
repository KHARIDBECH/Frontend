import React,{useState,useContext,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Cookies from 'js-cookie'
import {AuthContext} from './AuthContext';
import { config } from './Constants'
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding:38,
    paddingTop:0
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 export default function SignIn({openSignIn,setopenSignIn,setisloggedin}) {
  const url = config.url.API_URL
  const classes = useStyles();
  const [userData, setuserData] = useState({
    email: "",
    password: ""
  })

  const [isAuth,setAuth] = useContext(AuthContext);
  const [userId,setuserId] = useContext(AuthContext);
  const handleClose = (e) => {
    setopenSignIn(false);
  };
  let name,value;
  const handleChange=(e)=>{
    console.log(e.target.value);
    name=e.target.name;
    value=e.target.value;
    setuserData({...userData,[name]:value});
  }
  const postData = (e)=>{
    e.preventDefault();
    fetch(`${url}/api/auth/signin`,{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(userData)
    })
    .then(response=>{
      if (response.status===401) {
        throw Error(response.statusText);
    }
    
    return response.json();
  }
    )
    .then((data)=>{
      console.log("te h data",data)
      setopenSignIn(false);
      setisloggedin(true)
      Cookies.set("Token", data.token);
      Cookies.set("isAuth",true)
      Cookies.set("userId",data.userId);
      console.log("pri",userId)
      
    })
    .catch((err)=>{
      console.log("err",err)
    })


  }
  return (
    <div>
      <Dialog
        open={openSignIn}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        
              <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={postData}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
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
            id="password"
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
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={()=>{console.log("fckkkkk")}}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      </Dialog>
    </div>
  );
}
