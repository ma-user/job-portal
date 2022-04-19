import JobApplicants from './JobApplicants'
import React, {Component} from 'react';
import JobCard from './JobCard';
import axios from 'axios';


class ViewJobs extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
            jobsobj : [],
            isLoading: true,
            toSend:'',
            do_update:true,           
        };
        this.check1=true;
        this.toggleDoUpdate=this.toggleDoUpdate.bind(this);
        this.check2=true;
        this.recruiter = '';
        this.check3=true;
        this.onClickAccept = this.onClickAccept.bind(this);
    }
  
    
    componentDidMount() {
        axios.get('http://localhost:4000/recruiter')
             .then(response => {
                 var dat=response.data
                 this.setState({recruiters: dat});
             })
             .catch(function(error) {
                 var message=error;
                 console.log(message);
             })
        axios.get("http://localhost:4000/recruiter/session")
             .then(res => {
                 var data=res.data[0].email;
                    this.email = data
                    axios.post("http://localhost:4000/job/getjobs",{
                        email: data
                    })
                         .then(res => {
                                var data=res.data;
                                this.setState({
                                    jobsobj:data,
                                    isLoading: false
                                })
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

    onClickAccept(props){
        var toggle= !this.state.showComponent
        this.setState({
            toSend: props,
            showComponent:toggle,
        });
       }
   

        componentDidUpdate(prevProps,prevState){
            var check=prevState.do_update
            if(check!==this.state.do_update){
                var email=this.email;
            axios.post("http://localhost:4000/job/getjobs",{
                email: email
            })
                            .then(res => {
                                var dat=res.data;
                                    this.setState({
                                        jobsobj:dat
                                    })

                                    this.state.jobsobj.map(item=>{
                                        var tosend=this.state.toSend._id
                                        if(item._id === tosend)
                                        {
                                            this.setState({
                                                toSend:item
                                            })
                                        }
                                    })
                                     this.forceUpdate();
                         })
                         .catch(function(error) {
                            var message=error
                             console.log(message);
                         })}
    }

    toggleDoUpdate()
    {
        this.setState({do_update:!this.state.do_update})
    }
    render() {
        var jobsobj=this.state.jobsobj;
        const JobItems = jobsobj.map(item =>{ 
                                                    if(item.max_pos > 0){
                                                        return <JobCard key={item} item={item} onClickAccept={this.onClickAccept}/>
                                                    }
                                                }) 
        if(this.isLoading===true){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else{
        return(
            <div>
            {
                this.state.showComponent===false? <div>
                <h2>Posted Jobs</h2>
                    {JobItems}
                </div> :<JobApplicants job={this.state.toSend} onClickAccept={this.onClickAccept} toggleDoUpdate={this.toggleDoUpdate}/>
                
            }
            </div>
        )
        }
    }

}

export default ViewJobs;