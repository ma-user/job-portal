import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import axios from 'axios';

import Slider from '@material-ui/core/Slider';
import Joblist from './JobList'


var _ = require('underscore');

 

 
function valuetext(value) {
    return `${value}`;
  }

class JobListings extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
           durationLimit:'7',
           salary_limits:'',
           sortValue: 'Salary',
           inputValue: '',
           isLoading: true,
           sortOrder: 'Ascending',
           jobs: [],
           job:{},
           big_limits:'',           
           check_box:{"a":true,"b":true,"c":true},
           
        };
       this.handleChangeBoxA=this.handleChangeBoxA.bind(this)
       this.handleChangeBoxB=this.handleChangeBoxB.bind(this)
       this.handleChangeBoxC=this.handleChangeBoxC.bind(this)
        this.email='';
        this.user='';
        this.max_salary = -1;
        this.min_salary = Number.MAX_SAFE_INTEGER -5;
        this.type_to_number={"Full-Time":"a","Part-Time":"b","Work From Home":"c"};
        this.current_time={
            year : new Date().getFullYear(),
            date : new Date().getDate(), 
            hours : new Date().getHours(), 
            month : new Date().getMonth() + 1,
            min : new Date().getMinutes(),
       }
    }
    handleChangeBoxA(event) {

        var y=event.target.checked
        let old =this.state.check_box;
        old["a"]=y
        this.setState({
            check_box:old
        })         
     };
    componentDidMount() {
        axios.get('http://localhost:4000/job')
             .then(response => {
                 var dat=response.data;
                 this.setState({jobs:dat});
             })
             .catch(function(error) {
                 var dat=error;
                 console.log(dat);
             })
        axios.get("http://localhost:4000/user/session")
             .then(res => {
                    var dat=res.data;
                    var temp=dat[0].email;
                    this.email = temp;
                    var JobItems = this.state.jobs.map(item =>{ 
                                                    if(!item.rejected.includes(this.email)){
                                                        if(!item.accepted.includes(this.email))
                                                        {
                                                            this.max_salary=Math.max(this.max_salary,item.salary);
                                                            this.min_salary=Math.min(this.min_salary,item.salary)
                                                            return item;
                                                    }
                                                    }
                                                    else{
                                                        return null;
                                                    }
                                                });
                    this.setState({
                        salary_limits: [this.min_salary, this.max_salary]
                    });
                    
                    this.setState({jobs: _.compact(JobItems)});
                   var sending=this.email;
                    axios.post("http://localhost:4000/user/findone",{
                        email:sending
                    })
                    .then(res=>{
                        var dat=res.data;
                        this.user=dat;
                        
                            this.setState({isLoading: false});
                    })
                    .catch(function(error){
                        console.log(error);
                    })
             })
             .catch(function(error) {
                 console.log(error);
             })
             
    }
    handleChangeBoxB(event){

        let old =this.state.check_box;
        old["b"]=event.target.checked
        this.setState({
            check_box:old
        })         
     }

    sortJobs = (jobs)=>{
        var value=this.state.sortValue;
        var order=this.state.sortOrder;
        if (value==="Salary")
        {
            if(order==="Ascending"){
                return [...jobs].sort((a,b) => {
                   
                    if(a.salary<b.salary) {
                        return -1
                    }else return 1
                    })
            }
            else{
                return [...jobs].sort((a,b) => {
                    if(a.salary < b.salary) {
                        return 1
                    }else return -1
                    })
            }
        }
        else if(value==="Duration"){
            if(order==="Ascending")
            {
                return [...jobs].sort((a,b) => {
                    if(a.duration < b.duration) {
                        return -1
                    }else return 1
                })
            }
            else{
                return [...jobs].sort((a,b) => {
                    if(a.duration < b.duration) {
                        return 1
                    }else return -1;
                })
            }
        }
        else if(value==="Rating"){
            if(order==="Ascending")
            {
                return [...jobs].sort((a,b) => {
                    if(a.no_of_raters<1)
                        return -1
                    else if(b.no_of_raters<1)
                        return 1
                var a_final=a.rating/a.no_of_raters;
                var b_final=b.rating/b.no_of_raters
                if(a_final < b_final) {
                    return -1
                }else return 1
            })
            }
            else{
                return [...jobs].sort((a,b) => {
                    if(a.no_of_raters<1)
                        return 1;
                    if(b.no_of_raters<1)
                        return -1
                var a_final=a.rating/a.no_of_raters;
                var b_final=b.rating/b.no_of_raters
                if(b_final > a_final) {
                    return 1
                }return -1;
            })
            }
        }
    }
    handleChangeBoxC (event) {

        let old =this.state.check_box;
        old["c"]=event.target.checked
        this.setState({
            check_box:old
        })         
     }
    handleSortJobs = (event) => {
        var val=event.target.value;
    this.setState({
        
        sortValue: val
    })
    }

    handleSortOrder = (event) => {
        var val=event.target.value;
    this.setState({
        sortOrder: val
    })
    }

    handleFilterDuration = (event) => {
        var val=event.target.value;
        this.setState({
            durationLimit: val
        })
        }

    jobFilterOnChange = (event) => {
        var val=event.target.value;
    this.setState({
        inputValue: val
    })

    }

    formFunc(props){
        var event;
        if(props==="Full-Time")
           event=this.handleChangeBoxA;
       else if(props==="Part-Time")
           event=this.handleChangeBoxB;
       else
           event=this.handleChangeBoxC;
       
       return(
           <FormControlLabel
                       control={<Checkbox checked={this.state.check_box[this.type_to_number[props]]} onChange={event} name={this.type_to_number[props]} />}
                       label={props}
                   />  
       )
    }

    render() {
       
        
        function displayRange(props)
        {
            return(<label>{props[0]}  -   {props[1]}</label>)
        }
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
         

         const handleChangeSlider = (event, newValue) => {
            this.setState({
                salary_limits: newValue
            })
          };

          var duration_values=["10","1","2","3","4","5","6","7"];

    
        const filteredJobs = 
            this.state.jobs.filter(job => {
                
                var year=job.deadline.split("-")[0];
                var month=job.deadline.split("-")[1];
                var date=job.deadline.split("-")[2];
                var hour=job.deadline.split("-")[3];
                var minute=job.deadline.split("-")[4];
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
 
            return (
            deadline_met
            && (job.salary>=this.state.salary_limits[0] 
            && job.duration<this.state.durationLimit 
            && this.state.check_box[this.type_to_number[job.job_type]]
            && job.salary<=this.state.salary_limits[1]) 
            && job.title.toLowerCase().includes(this.state.inputValue.toLowerCase()) 
            
            )})


        if(this.isLoading===true){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else {
            return (
                <div>
                    <div>
                        <Typography id="range-slider" gutterBottom>
                            Salary Range
                        </Typography>
                        <Slider
                            onChange={handleChangeSlider}
                            valueLabelDisplay="auto"
                            min={this.min_salary}
                            step={1}
                            max={this.max_salary}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            value={this.state.salary_limits}                           
                        />
                         <Typography>Range: {displayRange(this.state.salary_limits)}</Typography>
                    </div>  
                    

                    <h6 style={{display:"inline"}}>Filter Options</h6>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <h6  style={{display:"inline"}}> Duration</h6>&nbsp;
                    <select name="durationLimit" onChange={this.handleFilterDuration}>
                        {hehe(duration_values)}
                    </select> 
                    <br/>
                    <label>Sort Options</label>
                    <select name="sortValue" onChange={this.handleSortJobs}>
                       {hehe(["Salary","Duration","Rating"])}
                    </select> 
                    <select name="sortOrder" onChange={this.handleSortOrder}>
                        {hehe(["Ascending","Descending"])}
                    </select> 
                                 
                    <FormGroup row>
                       {this.formFunc("Full-Time")}
                       {this.formFunc("Part-Time")}  
                       {this.formFunc("Work From Home")}  
                    </FormGroup>
                    
                    < Joblist jobFilterOnChange={this.jobFilterOnChange}
                    jobs={this.sortJobs(filteredJobs)} email={this.email}
                    inputValue={this.state.inputValue}  user={this.user}                        
                       /> 
                </div>
            )
        }
    }
}

export default JobListings;