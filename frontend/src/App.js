import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UserApp from './components/Users/UserApp'
import RecruiterApp from './components/Recruiter/RecruiterApp'
// import Home from './components/Common/Home'
import Login from './components/Common/Login'
import Register from './components/Common/Register'
import Navbar from './components/Common/templates/Navbar'
// import Profile from './components/Users/Profile'

function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/" exact component={Navbar}/>
        <Route path="/register" exact component={Navbar}/>
        <br/>
        <Route exact path="/" exact component={Login}/>
        <Route path="/users" component={UserApp} />
        <Route path ="/recruiters" component={RecruiterApp} />
        <Route path="/register" component={Register}/>
      </div>
    </Router>
  );
}

export default App;
