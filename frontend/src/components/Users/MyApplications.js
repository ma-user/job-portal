import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import AppliedItem from './AppliedItem'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import axios from 'axios';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
var _ = require('underscore');

class MyApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
           sortValue: 'Name',
           isLoading: true,
           sortOrder: 'Ascending',
          
        };
        this.email=""
        this.jobs=[]        
        this.user=""
    }
    componentDidMount() {
        axios.get('http://localhost:4000/job')
             .then(response => {
                 var dat=response.data;
                 this.jobs=dat;
                 axios.get("http://localhost:4000/user/session")
                .then(res => {
                    var dat=res.data[0].email
                    this.email = dat;
                   
                    var JobItems = this.jobs.map(item =>{
                                                    if(item.rejected.includes(this.email))
                                                        return item;
                                                    else if( item.accepted.includes(this.email))
                                                        return item;
                                                    else if(item.applicants.includes(this.email))
                                                        return item;
                                                    else if(item.shortlisted.includes(this.email))
                                                        return item;                                                    
                                                    else{
                                                        return null;
                                                    }
                                                });
                                           
                    this.jobs=_.compact(JobItems); 
                    console.log("HI");
                    if(this.state.isLoading===true)
                        this.setState({isLoading: !this.state.isLoading});
                    console.log(this.state.isLoading)
             })
             .catch(function(error) {
                 var message=error;
                 console.log(message);
             })
             })
             .catch(function(error) {
                var message=error;
                 console.log(message);
             })
        
             
    }
render(){

    if(this.state.isLoading===true){
        return(
            <div>
                Loading...
            </div>
        )
    }
    else{
        function giveHeadings(props)
        {
        return (
            props.map(item=>{
                var align="right"
                if(item=="Title")
                  align="left"
                 return <TableCell align={align}>{item}</TableCell>
            })
        )
        }
        
    return(
   <>
        <div>
        <TableContainer component={Paper}>
        <Table  aria-label="simple table">
            <TableHead>
            <TableRow>
                {giveHeadings(["Title","Salary","Date of Joining","Name of Recruiter","Status","Rate This Job"])}
            </TableRow>
            </TableHead>
            <TableBody>
            {
            this.jobs.map(job => {
                var email=this.email
            return <AppliedItem job={job} email={email} />
            })
            }
            </TableBody>
        </Table>
        </TableContainer>
        </div>
    </>
        )
        }
    }
}


export default MyApplications