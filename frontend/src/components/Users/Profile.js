import React, {Component} from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function giveRow(props)
{
  return (
    props.map(item=>{
        return <TableCell align="right">{item}</TableCell>
    })
  )
}


class Profile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            newEdu:'',
          
            sortName:true, 
            newSkill:'',
            users: [],
            newStart:'',
            isLoading: true,
            newEnd:'',
            
        };
        this.check1=true;
        this.onAddSkill = this.onAddSkill.bind(this);
        this.user = '';
        this.onAddEdu = this.onAddEdu.bind(this);
        this.notes = ['***'];
        this.onAddStart = this.onAddStart.bind(this);
        this.edus = [{}];
        this.onAddEnd = this.onAddEnd.bind(this);
        this.check2=true;
        this.check3=true;
        this.email = ''; 
        this.check4=true;         
    }

    onAddSkill(event){
        var val=event.target.value
        this.setState({newSkill: val});
       
    }
    
    onAddStart(event){
        var val=event.target.value
        this.setState({newStart: val});
    }
    giveInput(props)
    {
        return(
            props.map(item=>{
                return <div className={item[0]}>
                <input type="text" 
                    className="form-control"
                    placeholder={item[1]}
                    value={item[2]}
                    onChange={item[3]}
                    />
            </div>
            })
        )
    }
    giveButton(props)
    {
        
        return (
        <div className={props}>
        <input type="submit"
            value="Add"
            className="btn btn-primary"
            />
        </div>
        )
        
    }
    

    componentDidMount() {
        axios.get('http://localhost:4000/user')
             .then(response => {
                 var data=response.data;
                 this.setState({users: data});
             })
             .catch(function(error) {
                 var message=error;
                 console.log(message);
             })

        axios.get("http://localhost:4000/user/session")
             .then(res => {
                   var dat=res.data[0].email;
                    this.email = dat;
                    axios.post("http://localhost:4000/user/findone",{
                    email: dat
                })
                         .then(res => {
                                var dat=res.data;
                                this.user=dat;
                                var skills=dat.skills
                                this.notes = skills;
                                var education=dat.education;
                                this.edus = education;
                                
                                if(this.state.isLoading===true)
                                    this.setState({isLoading:false});
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

    onAddEdu(event){
        var val=event.target.value
        this.setState({newEdu: val});
        
    }



  
    onSubmit = (e) => {
        e.preventDefault();
        var inclusioncheck=false;

        var email=this.email;
        var newskill=this.state.newSkill
        this.notes.map( function (ele){
            var lowele=ele.toLowerCase();
            var lowskill=newskill.toLowerCase();
        if(lowele===lowskill)
                inclusioncheck=!inclusioncheck;
        })
        if(inclusioncheck===true)
        {
            alert("This Skill Has Already Been Added");   
        }
        else
        {
            var message;
            axios.put("http://localhost:4000/user/addskill",{
                email:email,
                newskill: newskill
            })
            .then(res => {
                 message=res;
            })
            .catch(function(error) {
                 message=error;
                
            })  
            console.log(message);   
        }
        window.location.reload();
        this.setState({
            newSkill:'',
        })
    }
    onAddEnd(event){
        var val=event.target.value
        this.setState({newEnd: val});
    }
     SkillItems() {
         return(this.notes.map(item=>{
             return<h6>{item}</h6>
         }))
        }

    EduItems() {
        return(this.edus.map(item=>{
            return<h6>Institute: {item.Institute}
            <br/>
            Start Year: {item.StartYear}
            <br/>
            End Year: {item.EndYear}</h6>
        }))
        }

    eduSubmit = (e) => {
        e.preventDefault();
       
        if( !(/^\d{4}$/.test(this.state.newStart)) || !(/[a-zA-Z]/.test(this.state.newEdu)))
        {
            alert("Please follow the mentioned format");    
        }
        else
        {
            var message="Please follow the mentioned format";
            if(this.state.newEnd!=false && (!/^\d{4}$/.test(this.state.newEnd)))
            {
                alert(message);
            }
            else if(this.state.newEnd!=false &&  parseInt(this.state.newStart)>parseInt(this.state.newEnd))
                alert(message);
            else{
            var email=this.email;
            var institute=this.state.newEdu;
            var start=parseInt(this.state.newStart);
            var end=parseInt(this.state.newEnd)
            axios.put("http://localhost:4000/user/addeducation",{
                email: email,
                institute: institute,
                start: start,
                end: end
            })
            .then(res => {
               message=res;
            })
            .catch(function(error) {
                message=error;
                
            })  
            } 
            console.log(message); 
        }
        window.location.reload();
        this.setState({
            newSkill:'',
        })
    }

    render() {
        if(this.isLoading===true){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else{
            var showRating;
            if(this.user.no_of_raters===0)
                showRating=0;
            else 
                showRating=this.user.rating/this.user.no_of_raters

            var formDetails1=
               [["form-group","",this.state.newSkill,this.onAddSkill]]
               
             var formDetails2=[
                 ["edu-group","Institute (required)",this.state.newEdu,this.onAddEdu],
                 ["edu-group","Start Year:YYYY (required)",this.state.newStart,this.onAddStart],            
                 ["edu-group","End Year:YYYY (optional and greater than start year)",this.state.newEnd,this.onAddEnd]
                ]
            
            return (
                <div>
                     <h4>Profile</h4>
                      
                        <TableContainer>
                            <Table  aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                {giveRow(["Username","Email Id", "Current Rating","No. of Ratings","Your Skills","Education Details"])}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {giveRow([this.user.name,this.email,showRating,this.user.no_of_raters,this.SkillItems(),this.EduItems()])}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <form onSubmit={this.onSubmit}>
                        <label>Add new skill: </label>
                            {this.giveInput(formDetails1)}
                            {this.giveButton("form-group")}
                        </form>  
                        
                        <form onSubmit={this.eduSubmit}>
                            {this.giveInput(formDetails2)}
                            {this.giveButton("edu-group")}
                        </form>           
                                   
                </div>
            )
        }
    }
}

export default Profile;