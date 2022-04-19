import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Profile from './Profile'
import UserNavbar from './UserNavbar'
import JobListings from './JobListings'
import MyApplications from './MyApplications'

function returnRoute(props){
  return(
    props.map(item=>{
       return  <Route path={item[0]} exact component={item[1]}/>
    })

)
}
function UserApp() {
  return (
    <Router>
      <div className="container">
        <UserNavbar/>
        <br/>
        {returnRoute([["/users/userprofile",Profile],["/users/joblistings",JobListings],["/users/myapplications",MyApplications]])}
      </div>
    </Router>
  );
}

export default UserApp;