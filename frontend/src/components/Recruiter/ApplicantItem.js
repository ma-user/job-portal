import axios from 'axios';
import React, {Component} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

class ApplicantItem extends Component {
    //console.log(props);

    constructor(props) {
        super(props);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.skills_array= this.props.user.skills.map(skill => {
            return <div>{skill}</div>
            })
        this.onClickReject = this.onClickReject.bind(this);
        

        this.status= '';
        this.status1='';
        this.onClickShortlist = this.onClickShortlist.bind(this);
    }

    
    ApplyOptionRejection(){
        // console.log(props)
        function sayHello() {
            var message = "All Positions Have Been Filled, Increase Limit to Accept";
            alert(message);
        }
        
        return (
            <Button color="primary" onClick={sayHello}>Accept</Button>
        );
    }
    
    onClickAccept(){
        axios.post("http://localhost:4000/job/acceptapp", {
            id: this.props.job._id,
            email: this.props.user.email
        })
            .then(res=>{
                this.user=res.data;
                if(this.props.job.max_pos == 1){
                    this.props.job.applicants.map(userboi => {
                        axios.post("http://localhost:4000/job/rejectapp",{
                            id: this.props.job._id,
                            email: userboi
                        })
                            .then(res1=>{
                                var message = res1;
                                console.log(message);
                            })
                            .catch(function(error){
                                var message = error;
                                console.log(message);
                            })
                    });

                    this.props.job.shortlisted.map(userboi => {
                        if(userboi != this.props.user.email){
                            axios.post("http://localhost:4000/job/rejectapp",{
                                id: this.props.job._id,
                                email: userboi
                            })
                                .then(res1=>{
                                    var message = res1;
                                    console.log(message);
                                })
                                .catch(function(error){
                                    var message = error;
                                    console.log(message);
                                })
                        }
                    });
                }

                axios.get("http://localhost:4000/job")
                    .then(res1 => {
                        res1.data.map(ajob => {
                            if((ajob._id != this.props.job._id)){
                                if(ajob.applicants.includes(this.props.user.email) || ajob.shortlisted.includes(this.props.user.email))
                    
                                axios.post("http://localhost:4000/job/pullapp", {
                                    id: ajob._id,
                                    email: this.props.user.email
                                })
                                    .then(res2=>{
                                        var message = res2;
                                        console.log(message);
                                    })
                                    .catch(function(error){
                                        var message = error;
                                        console.log(message);
                                    })
                            }
                        })
                    })
                    .catch(function(error){
                        var message = error;
                        console.log(message);
                    })
                    
                    this.props.toggleDoUpdate()
                // this.setState({isLoading: false});
                
            })
            .catch(function(error){
                var message = error;
                console.log(message);
            })

            
            alert("Application Accepted")
    }

    ApplyOptionAccept(){            
        return (
            <Button color="primary" onClick={this.onClickAccept}>Accept</Button>       
        );
    } 

    onClickReject(){
        axios.post("http://localhost:4000/job/rejectapp", {
            id: this.props.job._id,
            email: this.props.user.email
        })
            .then(res=>{
                var dat = res.data
                this.user=dat;
                this.props.toggleDoUpdate();
            })
            .catch(function(error){
                var message = error;
                console.log(message);
            })
            alert("Application Rejected")
            
            // window.location.reload()
    }

    Rejection(){            
        return (
            <Button color="secondary" onClick={this.onClickReject}>Reject</Button>       
        );
    }

    onClickShortlist(){
        axios.post("http://localhost:4000/job/shortlistapp",{
            id: this.props.job._id,
            email: this.props.user.email
        })
            .then(res=>{
                this.user=res.data;
                this.props.toggleDoUpdate()
                alert("Application Shortlisted")
            })
            .catch(function(error){
                var message = error;
                console.log(message);
            })
    }

    Shortlist(){            
        return (
            <Button color="primary" onClick={this.onClickShortlist}>Shortlist</Button>       
        );
    }

    

    giveRow(props)
    {
      return (
        props.map(item=>{
           return <TableCell align="right">{item}</TableCell>
        })
      )
    }

        

        

        

        

        render(){
            var jobb = this.props.job;
            var mail = this.props.user.email;
            var show = <label style={{ color: 'green' }}>Accepted</label>;
            
            if(jobb.applicants.includes(mail))
            {
                this.status1 = this.Rejection()
                this.status = this.Shortlist()
            }
            else if(jobb.accepted.includes(this.props.user.email))
            {   
                this.status = show;
            }
            else if(jobb.shortlisted.includes(mail) && (jobb.max_pos > 0))
            {          
                this.status = this.ApplyOptionAccept();
                this.status1 = this.Rejection()
            }
            else if(jobb.shortlisted.includes(mail))
            {
                this.status = this.ApplyOptionRejection()
                this.status1 = this.Rejection()
            }

            var rowEle=[this.props.user.name, this.skills_array, this.props.doa[this.props.user.email], this.props.sop[this.props.user.email], this.props.user.rating]

            return(
                <TableRow key={this.props.user._id}>
                    {this.giveRow(rowEle)}
                    <TableCell align="right">{this.status} {this.status1}</TableCell>
                </TableRow>
            )
        }

    
    }

export default ApplicantItem;