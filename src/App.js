
import './App.css';
import React,{useState} from "react";
import Header from './Header';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Content from './Content';
import Banner from './Banner';
import AdsDetails from './AdsDetails';
import {AuthContextProvider} from './AuthContext';
import ItemDetails from "./ItemDetails"
import Messenger from "./Messenger"
function App() {
  const [openSignIn, setopenSignIn] = useState(false)
  const [openSignUp, setopenSignUp] = useState(false)

 
  return (
<Router>
    <div className="App">
    <AuthContextProvider>
    <Header openSignIn={openSignIn} setopenSignIn={setopenSignIn} openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
    <Switch>
    <Route exact path="/">
    <Banner/>
          <Content/>
        </Route> 
      </Switch>
      <Route exact path="/postad"><AdsDetails/>
      </Route>
      <Route exact path="/item/:productUrl">
        <ItemDetails/>
        </Route>
        <Route exact path="/chat"><Messenger/>
      </Route>
      </AuthContextProvider>
    </div>
    </Router>
  );
}

export default App;
