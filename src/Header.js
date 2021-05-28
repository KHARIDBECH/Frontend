import React,{useEffect,useContext,useState} from "react";
import "./header.css";
import logo from "./appLogo.png";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from "@material-ui/icons/Add";
import SignIn from './SignIn';
import SignUp from './SignUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import {AuthContext} from './AuthContext';
import Cookies from 'js-cookie';
import {useHistory} from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    borderRadius: "34px",
    backgroundColor: "#bb0467"
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const Pending = () => {
  return (
    <div className="filter-options-nav">
      <div className="filter-options">
        <div className="filter-options-list">
          Cars
       </div>
        <div className="filter-options-list">
          Truck
       </div>
        <div className="filter-options-list">
          Ambulance
       </div>
        <div className="filter-options-list">
          Fridge
       </div>
        <div className="filter-options-list">
          Bus
       </div>
        <div className="filter-options-list">
          Computer
       </div>
        <div className="filter-options-list">
          Mobile
       </div>
      </div>
    </div>
  )
}

const LoggedinHeader = ({setisloggedin}) => {
  const classes = useStyles();
  let history = useHistory();
  const logout = ()=>{
    Cookies.remove('isAuth');
    Cookies.remove('Token');
    setisloggedin(false)
    history.push('/')
   
    
  }
  return (
    <div>
      <nav className="header">

        <Link to="/">
          <img className="header-logo" src={logo} alt="logo" />
        </Link>
        {/* search Box */}
        <div className="header_search">
          <input type="text" className="header_searchInput" />
          <SearchIcon className="header_searchIcon" />
        </div>
        <div className="header_nav">
          <div className="header_option" > <ChatBubbleOutlineIcon />
          </div>
          {/* <Link to="/signup" className="header_link"> */}
          <div className="header_option" > <Avatar alt="Remy Sharp" src="/broken-image.jpg" className={classes.orange} /></div>
          {/* </Link> */}
          {/* 2nd link */}
          <div className="header_option" onClick={()=>{logout()}}>Logout</div>
          <Link to="/postad" className="header_link">
            <div className="header_option">
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<AddIcon />}
              >
                <span style={{ fontFamily: "sans-serif" }}>SELL</span>
              </Button>
            </div>
          </Link>

        </div>
      </nav>
      <Pending />
    </div>
  )
}
export default function Header({ openSignIn, setopenSignIn, openSignUp, setopenSignUp,}) {
  const classes = useStyles();
  const [is_Auth,setAuth] = useContext(AuthContext);
  const [isloggedin, setisloggedin] = useState(false)
  
  useEffect(() => {
    console.log("type",typeof(isAuth))
    if(is_Auth=="true"){
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
    <div>
      {
        isloggedin ? (<LoggedinHeader setisloggedin = {setisloggedin}/>) :
          <div>
            <nav className="header">

              <Link to="/">
                <img className="header-logo" src={logo} alt="logo" />
              </Link>
              {/* search Box */}
              <div className="header_search">
                <input type="text" className="header_searchInput" />
                <SearchIcon className="header_searchIcon" />
              </div>
              <div className="header_nav">
                {/* 1st link */}

                {/* <Link to="/signin" className="header_link"> */}

                <div className="header_option" onClick={setModalSignIn}>Sign In</div>


                {/* <Link to="/signup" className="header_link"> */}
                <div className="header_option" onClick={setModalSignUp}>Sign Up</div>
                {/* </Link> */}
                {/* 2nd link */}
                <Link to="/postad" className="header_link">
                  <div className="header_option">
                    <Button
                      variant="contained"
                      color="secondary"
                      
                      className={classes.button}
                      startIcon={<AddIcon />}
                    >
                      <span style={{ fontFamily: "sans-serif" }}>SELL</span>
                    </Button>
                  </div>
                </Link>
                <SignIn openSignIn={openSignIn} setopenSignIn={setopenSignIn} setisloggedin={setisloggedin} />
                <SignUp openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
              </div>
            </nav>
            <Pending />
          
          </div>
      }
    </div>

  );
}


