
import React, {Component} from 'react';
import axios from 'axios';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

function hehe(props){
    return(
        props.map(item=>{
            if(item==="10")
            return <option value="10"> </option>
            else 
            return <option value={item}>{item} </option>
        })
    )
}

function labelReturn(props){
    return <label style={{ color: props[0] }}>{props[1]}</label>
}

class AppliedItem extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
           rating:"1"
        };
        this.rate_me=<label style={{ color: 'red' }}>Not Applicable</label>
        this.status= '';
        this.onClickRate=this.onClickRate.bind(this)
        this.doj=<label style={{ color: 'red' }}>Not Applicable</label>      
        this.current_time={
            year : new Date().getFullYear(),
            date : new Date().getDate(), 
            hours : new Date().getHours(), 
            month : new Date().getMonth() + 1,
            min : new Date().getMinutes(),
       }
    }

    
    onClickRate(){
        var email=this.props.email;
        var rating=this.state.rating;
        var id=this.props.job._id
        var message;
        axios.post("http://localhost:4000/job/ratejob",{
            email:email,
            rating: rating,
            id:id,
        })
        .then(res => {
            message=res;
        })
        .catch(function(error) {
            message=error;
        })
        console.log(message)
        window.location.reload()
    }
    handleRatingChange =(event) =>{
        var val=event.target.value
        this.setState({rating:val})
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
            var year=this.props.job.deadline.split("-")[0];
            var month=this.props.job.deadline.split("-")[1];
            var date=this.props.job.deadline.split("-")[2];
            var hour=this.props.job.deadline.split("-")[3];
            var minute=this.props.job.deadline.split("-")[4];
            var deadline_met=false;
            if(this.current_time.year<year)
            deadline_met=true;
        else if(this.current_time.year>year)
                deadline_met=false;
        
        else if(this.current_time.month>month)
            deadline_met=false
        else if(this.current_time.month<month)
            deadline_met=true;
            
        else if(this.current_time.date>date)
                deadline_met=false
        else if(this.current_time.date<date)
                deadline_met=true;

        else if(this.current_time.hour>hour)
                deadline_met=false
        else if(this.current_time.hour<hour)
                deadline_met=true;

        else if(this.current_time.minute>minute)
                deadline_met=false
        else if(this.current_time.minute<minute)
                deadline_met=true; 
            
        
        var rejected=this.props.job.rejected;
        var accepted=this.props.job.accepted;
        var applicants=this.props.job.applicants;
        var shortlisted=this.props.job.shortlisted;
        var has_rated=this.props.job.has_rated;
        if(rejected.includes(this.props.email) || deadline_met===false)
            {
                this.status=labelReturn(["red","Rejected"])
            }
        else if(accepted.includes(this.props.email))
            {   
                this.rate_me=<div>
                            <select name="rating" onChange={this.handleRatingChange}>
                           {hehe(["1","2","3","4","5"])}
                            </select> 
                            <Button color='primary' size='small' onClick={this.onClickRate}>Submit Rating</Button>
                            </div>

                has_rated.map(item =>{
                    var rating=item.rating;
                    if(item.email===this.props.email)
                    {
                        this.rate_me=rating;
                    }
                })

                this.status=labelReturn(["green","Accepted"])

                this.props.job.doj.map(item=> {
                    if(item.email===this.props.email){
                        this.doj=labelReturn(["green",item.date])
                    }
                })
            }

             
            else if(deadline_met===true)
            {
                if(applicants.includes(this.props.email))
                this.status=labelReturn(["blue","Applied"])
                else
                this.status=labelReturn(["orange","Shortlisted"])
            }
            var title=this.props.job.title
            return(
                <TableRow key={this.props.job._id}>
                    <TableCell>{title}</TableCell>
                    {this.giveRow([this.props.job.salary,this.doj,this.props.job.name,this.status,this.rate_me])}
                </TableRow>
            )
        }
    }

export default AppliedItem;