
import './App.css';
import React,{useState} from "react";
import Header from './Header';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Content from './Content';
import Banner from './Banner';
import AdsDetails from './AdsDetails';
import {AuthContextProvider} from './AuthContext';
function App() {
  const [openSignIn, setopenSignIn] = useState(false)
  const [openSignUp, setopenSignUp] = useState(false)
  const [searchVal, setsearchVal] = useState("")
 
  return (
<Router>
    <div className="App">
    <AuthContextProvider>
    <Header openSignIn={openSignIn} setopenSignIn={setopenSignIn} openSignUp={openSignUp} setopenSignUp={setopenSignUp} setsearchVal={setsearchVal} searchVal={searchVal}/>
    <Switch>
    <Route exact path="/">
    <Banner/>
          <Content searchVal={searchVal}/>
        </Route> 
      </Switch>
      <Route exact path="/postad"><AdsDetails/>
      </Route>
      <Route exact path="/item/:productUrl">
        this is detail
        </Route>
      </AuthContextProvider>
    </div>
    </Router>
  );
}

export default App;
