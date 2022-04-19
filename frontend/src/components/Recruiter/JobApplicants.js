import React, {Component} from 'react';
import axios from 'axios';
import ApplicantsList from './ApplicantList'


class JobApplicants extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
           user:{},
           sortValue: 'Name',
           isLoading: true,
           sortOrder: 'Ascending',
        };
        this.users=[];
        this.dateMap = {};
        this.sopMap = {};
    }

    componentDidMount() {
        axios.get("http://localhost:4000/user/")
             .then(res => {
                    var dat = res.data;
                    this.users = dat;
                    this.setState({isLoading:false})              
             })
             .catch(function(error) {
                 var message = error;
                 console.log(message);
             })
    
        this.props.job.doa.map( mapboi => {
            var dat = mapboi.date;
            this.dateMap[mapboi.email] = dat;
        });
        
        this.props.job.sop.map( sopboi => {
            var sopp = sopboi.text;
            this.sopMap[sopboi.email] = sopp;
        });
        console.log(this.sopMap);
             
    }

    hehe(props){
        return(
            props.map(item=>{
                if(item==="10")
                return <option value="10"> </option>
                else 
                return <option value={item}>{item} </option>
            })
        )
    }

    LoadingDone(){
        this.setState({isLoading:!this.state.isLoading})
    }
    sortUsers = (users) => {
        
        var value=this.state.sortValue;
        var order=this.state.sortOrder;

        if (value==="Name")
        {
            if(order==="Ascending"){
                return [...users].sort((a,b) => {
                   
                    if(a.name<b.name) {
                        return -1
                    }else return 1
                    })
            }
            else{
                return [...users].sort((a,b) => {
                    if(a.name < b.name) {
                        return 1
                    }else return -1
                    })
            }
        }
        else if(value==="Date of Application"){
            if(order==="Ascending")
            {
                return [...users].sort((a,b) => {
                    var amail = a.email;
                    var bmail = b.email;
                    if(this.dateMap[amail] < this.dateMap[bmail]) {
                        return -1
                    }else return 1
                })
            }
            else{
                return [...users].sort((a,b) => {
                    var amail = a.email;
                    var bmail = b.email;
                    if(this.dateMap[amail] < this.dateMap[bmail]) {
                        return 1
                    }else return -1;
                })
            }
        }
        else if(value==="Rating"){
            if(order==="Ascending")
            {
                return [...users].sort((a,b) => {
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
                return [...users].sort((a,b) => {
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
        else {
            return users
        }
    }

    handleSortUsers = (event) => {
    var val = event.target.value;
    this.setState({
        sortValue: val
    })
    }

    handleSortOrder = (event) => {
    var val = event.target.value;
    this.setState({
        sortOrder: val
    })
    }


    render() {
        
        var jobb = this.props.job;
        if(!this.state.isLoading){
            const filteredUsers = 
            this.users.filter(user => {     
                return ((jobb.applicants.includes(user.email))
                || (jobb.shortlisted.includes(user.email))
            )})
            
            return (
                <div>
                    <label>Sort Options</label>
                    <select name="sortValue" onChange={this.handleSortUsers}>
                        {this.hehe(["Name", "Date Of Application", "Rating"])}
                    </select> 
                    <select name="sortOrder" onChange={this.handleSortOrder}>
                        {this.hehe(["Ascending","Descending"])}
                    </select> 
                    <br/>
                    
                    
                    < ApplicantsList job={jobb} users={this.sortUsers(filteredUsers)} sop={this.sopMap} onClickAccept={this.props.onClickAccept} toggleDoUpdate={this.props.toggleDoUpdate} doa={this.dateMap} /> 
                </div>
            )
        }
        else{
            return(
                <div>
                    Loading...
                </div>
            )
        }
    }
}

export default JobApplicants;