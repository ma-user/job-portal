
import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Profile from './Profile'
import RecruiterNavbar from './RecruiterNavbar'
import AddJob from './AddJob'
import ViewJobs from './ViewJobs'
import AcceptedPage from './AcceptedPage'

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
        <RecruiterNavbar/>
        <br/>
       {returnRoute([["/recruiters/recruiterprofile",Profile],["/recruiters/addjob",AddJob],["/recruiters/viewjobs",ViewJobs],["/recruiters/acceptedpage",AcceptedPage]])}
      </div>
    </Router>
  );
}

export default UserApp;