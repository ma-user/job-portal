import React, {Component} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"


var message;
export default class UserNavbar extends Component {
    
    constructor(props) {
        super(props)
        this.logout = this.logout.bind(this);
    }

    logout(){
        axios.get("http://localhost:4000/recruiter/logout")
             .then(function(res){
                   message=res.data;
                   console.log(message);
             })
             .catch(function(error) {
                 message=error;
             })
             console.log(message);
        window.open("..","_self");
    }
    liReturn(props){
        return(
            props.map(item=>{
                return  <li className="navbar-item">
                <Link to={item[0]} className="nav-link">{item[1]}</Link>
                 </li>
            })
       
    )
    }

    render() {
        return (
            <div>                
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            {this.liReturn([["/recruiters/recruiterprofile","My Profile"],["/recruiters/addjob","Add Job"],["/recruiters/viewjobs","View Added Jobs"],["/recruiters/acceptedpage","View Accepted Applicants"]])}
                            <Button variant="contained" color="secondary" onClick={this.logout} >Logout</Button>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}