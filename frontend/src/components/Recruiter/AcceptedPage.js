import React, {Component} from 'react';
import axios from 'axios';
import AcceptedList from './AcceptedList'

var _ = require('underscore');

class AcceptedPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
           isLoading: true,
           sortValue: 'Name',
           user:{},
           sortOrder: 'Ascending',
           users:[],
        };

        this.email=''
        this.jobs=[];
        this.dateMap = {};
        
    }

    componentDidMount() {
        axios.get('http://localhost:4000/job')
             .then(response => {
                 var dat=response.data
                 this.jobs=dat;
                 axios.get("http://localhost:4000/recruiter/session")
                .then(res => {
                    var dat=res.data[0].email;
                    this.email = dat;
                    var JobItems = this.jobs.map(item =>{ 
                                                    if(item.email !== this.email){
                                                        return null;
                                                    }
                                                    else{
                                                        return item;
                                                    }
                                                });
                                                
                    this.jobs=_.compact(JobItems);

                    this.jobs.map(item =>{
                        item.doj.map( mapboi => {
                            var email=mapboi.email;
                            var date=mapboi.date;
                            this.dateMap[email] = date;
                        });
                        
                        item.accepted.map(user =>{
                            axios.post("http://localhost:4000/user/findone",{
                                email:user
                            })
                            .then(res =>{
                                var huh=0;
                                if(res.data.no_of_raters>0){
                                    var actual_rating=res.data.rating;
                                    actual_rating/=res.data.no_of_raters;
                                    huh=actual_rating}
                                var title =item.title;
                                var rating=huh;
                                var doj=this.dateMap[user];
                                var id=res.data._id;
                                var has_rated=res.data.has_rated;
                                var type=item.job_type;
                                var name=res.data.name;
                                this.setState({
                                    users:[...this.state.users,{
                                        title: title,
                                        doj: doj,
                                        type:type,
                                        rating: rating,
                                        has_rated:has_rated,
                                        name: name,
                                        id:id
                                    }]
                                })
                            })
                            .catch(function(error) {
                                var message =error;
                                console.log(message);
                            })
                            
                        })
                    })
                    if(this.state.isLoading===true)
                    this.setState({isLoading: !this.state.isLoading});
                    
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

    handleSortOrder = (event) => {
        var val=event.target.value
    this.setState({
        sortOrder: val
    })
    }


    LoadingDone(){
        if(this.state.isLoading===true)
            this.setState({isLoading:false})
        else
            this.setState({isLoading:true})
    }
    sortUsers(users){
        var value=this.state.sortValue;
        var order=this.state.sortOrder;
         if(value==="Name"){
            if(order==="Ascending")
            {
                return [...users].sort((a,b) => {
                if(a.name < b.name) {
                    return -1
                }else return 1
            })
            }
            else{
                return [...users].sort((a,b) => {
                if(b.name > a.name) {
                    return 1
                }return -1;
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
        else if(value==="Date Of Joining"){
            if(order==="Ascending")
            {
                return [...users].sort((a,b) => {
                    if(a.doj < b.doj) {
                        return -1
                    }else return 1
                })
            }
            else{
                return [...users].sort((a,b) => {
                    if(a.doj < b.doj) {
                        return 1
                    }else return -1;
                })
            }
        }
        else if(value==="Title"){
            if(order==="Ascending")
            {
                return [...users].sort((a,b) => {
                    if(a.title < b.title) {
                        return -1
                    }else return 1
                })
            }
            else{
                return [...users].sort((a,b) => {
                    if(a.title < b.title) {
                        return 1
                    }else return -1;
                })
            }
        }
    }
    
   
    handleSortUsers = (event) => {
        var val=event.target.value
    this.setState({
        sortValue: val
    })
    }

   

    render() {
        
        const filteredUsers=this.state.users
        function labelReturn(props){
            return(
                props.map(item=>{
                        return(<label>{item}</label>)
                })
            )
        }

        function OptionReturn(props){
            return(
                props.map(item=>{
                        return( <option value={item}>{item}</option>)
                })
            )
        }
     
        
        if(this.state.isLoading===true){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else{

            
            return (
                <div>
                    {labelReturn(["Sort Options"])}
                    <select name="sortValue" onChange={this.handleSortUsers}>
                      {OptionReturn(["Name","Date Of Joining","Rating","Title"])}
                    </select> 
                    <select name="sortOrder" onChange={this.handleSortOrder}>
                        {OptionReturn(["Ascending","Descending"])}
                    </select> 
                    <br/>
                    
                    
                    < AcceptedList email={this.email} users={this.sortUsers(filteredUsers)} /> 
                </div>
            )
        }
    }

}

export default AcceptedPage;