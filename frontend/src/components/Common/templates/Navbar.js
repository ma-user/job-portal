import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

export default class NavBar extends Component {
    
    constructor(props) {
        super(props);
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
                <nav className="navbar navbar-expand-lg  bg-light">
               
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            {this.liReturn([["/","Login"],["/register","Register"]])}
                            
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}