import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import React, {Component} from 'react';
import axios from 'axios';
import { validateFields } from '../Common/Validation';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';



class JobItem extends Component {
    

    constructor(props) {
        super(props);                
        
        this.SOP='Enter Your SOP'
        this.onClickAccept = this.onClickAccept.bind(this);   
        this.ApplyOptionFull=this.ApplyOptionFull.bind(this);
        this.rating=''
        this.status= '';
        this.skills_array= this.props.job.skills.map(skill => {
            return <div>{skill}</div>
            })
    }

    showStuff(){
        
    }

    ApplyOptionRejection(){
        function sayHello() {
            alert("Reached Max Limit of 10 open Applicatons");
        }
        
        return (
            <div><Button color="primary" onClick={sayHello}>Apply</Button></div>
        );
    }


    onClickAccept(){
        

        var obj =this.props;
        alertify.prompt('Enter SOP (less than 250 words )', 'Enter Your Statement of Purpose',
            function(evt, value){ 
            var str1=value;
            str1 = ((str1.replace(/(^\s*)|(\s*$)/gi,"")).replace(/[ ]{2,}/gi," ")).replace(/\n /,"\n");
            if(str1.split(' ').length<250){                
                axios.post("http://localhost:4000/job/applyjob",{
                    id: obj.job._id,
                    email: obj.email,
                    sop: value
                })
                    .then(res=>{
                        console.log("HI")
                        alert(res.data);
                        window.location.reload()
                        console.log("HI@");
                    })
            }
            else
            {
                alertify.message('You have exceeded the word limit, please try applying again');               
            }
            }
           
        ).setting({
            'labels': {cancel:'Cancel',ok:'Submit'},

        });
    }

        
    giveRow(props)
    {
      return (
        props.map(item=>{
           return <TableCell align="right">{item}</TableCell>
        })
      )
    }
        
        ApplyOptionFull(){
           
                alert("You have already been accepted into a job!!");
            
        }
        render(){

            if(this.props.job.rating != 0)
            {
                this.rating=this.props.job.rating/this.props.job.no_of_raters
              
            }
            else
            {
                this.rating=0;
            }

            if(this.props.user.accepted>0)
            {
                this.status =  <Button color="primary" onClick={this.ApplyOptionFull}>Apply</Button>
            }
            else if(this.props.job.applicants.includes(this.props.email) || this.props.job.shortlisted.includes(this.props.email))
            {   
                this.status=<h6 style={{ color: 'green' }}> Applied</h6>
            }
            else if(this.props.job.max_app<1 || this.props.job.max_pos<1)
            {
                this.status=<div><label style={{ color: 'red' }}>No Vacancies</label></div>
            }
            else if(this.props.user.no_of_app>9)
            {               
                this.status = this.ApplyOptionRejection()
                
            }
            else if(true)
            {          
                this.status = <Button color="primary" onClick={this.onClickAccept}>Apply</Button>          
            }

          
            var rowEle=[this.props.job.title,this.props.job.deadline,this.props.job.job_type,this.props.job.salary,this.props.job.duration
            ,this.skills_array,this.props.job.name,this.rating,this.status];
            return(
                
                <TableRow key={this.props.job._id}>
                   {this.giveRow(rowEle)}
                </TableRow>
                
            )
        }
    }

export default JobItem;