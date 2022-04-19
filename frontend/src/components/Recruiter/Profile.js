import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import React, {Component} from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';

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
            newContact:'', 
            sortName:true, 
            recruiters: [],
            newBio:'',
            isLoading: true
        };

        this.email = '';
        this.onChangeContact = this.onChangeContact.bind(this);
        this.check2=true;
        this.onChangeBio = this.onChangeBio.bind(this);
        this.notes = ['***'];
        this.check1=true;
        this.recruiter = '';
    }

    onChangeContact(event){
        var val=event.target.value
        this.setState({newContact: val});
    }


    componentDidMount() {
        axios.get('http://localhost:4000/recruiter')
             .then(response => {
                 var data=response.data;
                 this.setState({recruiters: data});
             })
             .catch(function(error) {
                 var message=error
                 console.log(message);
             })
        axios.get("http://localhost:4000/recruiter/session")
             .then(res => {
                    var dat=res.data[0].email
                    this.email =dat;
                    axios.post("http://localhost:4000/recruiter/findone",{
                        email: dat
                    })
                        .then(res => {
                                var bio=res.data.bio;
                                var num=res.data.contact_no
                                this.state.newBio = bio;
                                this.state.newContact = num;
                                this.recruiter=res.data;
                                if(this.state.isLoading===true)
                                    this.setState({isLoading: !this.state.isLoading});
                         })
                         .catch(function(error) {
                             var message=error
                             console.log(message);
                         })
             })
             .catch(function(error) {
                 var message=error
                 console.log(message);
             })
        
        
    }

   

    onChangeBio(event){
        var val=event.target.value
        this.setState({newBio: val});
    }

    componentDidUpdate() {
        axios.get('http://localhost:4000/recruiter')
             .then(response => {
                var data=response.data;
                this.setState({recruiters: data});
             })
             .catch(function(error) {
                 var message=error;
                 console.log(message);
             }) 
    }

    onSubmit = (e) => {

        e.preventDefault();
        var str1=this.state.newBio;
        var email=this.email;
        var number=this.state.newContact
        axios.post("http://localhost:4000/recruiter/contactno",{
            email:email,
            number: number
        })
            .then(res => {
                var message=res;
                console.log(message)
            })
            .catch(function(error) {
                var message=error;
                console.log(message);
            })        
        
        
        str1 = ((str1.replace(/(^\s*)|(\s*$)/gi,"")).replace(/[ ]{2,}/gi," ")).replace(/\n /,"\n");

        if(str1.split(' ').length>=251)
        {
            alert("Bio cannot exceed 250 words");
        }
        else
        {
            var email=this.email;
            var bio=this.state.newBio;
            axios.post("http://localhost:4000/recruiter/bio",{
                email:email,
                bio: bio
            })
            .then(res => {
                var message=res;
                console.log(message)
            })
            .catch(function(error) {
                var message=error;
                console.log(message);
            })        
        }
        this.setState({
            newContact :'',
            newBio :''
        })
        window.location.reload();
    }
    giveButton(props)
    {
        
        return (
        <div className={props}>
        <input type="submit"
            value="Save"
            className="btn btn-primary"
            />
        </div>
        )
        
    }

    render() {

        function pls_work1(item)
        {
                    return(
                        <div className="form-group">
                        <label>{item[0]} </label>
                        <input type="text" 
                            className="form-control"
                            value={item[1]}
                            placeholder={item[2]}
                            onChange={item[3]}
                            />
                        </div>
                    )
        }

        function pls_work2(item)
        {
                    return(
                        <div>
                        <label>{item[0]} </label>
                        <br/>
                        <textarea
                            value={item[1]}
                            placeholder={item[2]}
                            onChange={item[3]}
                            />
                        </div>
                    )
        }

        if(this.isLoading===true){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else{
            return (
                <div>
                    <h4>Profile</h4>
                    <TableContainer>
                            <Table  aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                <TableCell align="left">Username</TableCell>
                                {giveRow(["Email Id", "Contact Number","Bio"])}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableCell align="left">{this.recruiter.name}</TableCell>
                                {giveRow([this.email,this.recruiter.contact_no,this.recruiter.bio])}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <form onSubmit={this.onSubmit}>
                            {pls_work1(["Contact Number",this.state.contact_no,this.recruiter.contact_no,this.onChangeContact])}
                            {pls_work2(["Bio(max 250 words",this.state.newBio,this.recruiter.bio,this.onChangeBio])}
                            <label>Save Changes</label>
                            {this.giveButton("form-group")}
                        </form>
                        
                </div>
            )
        }
    }
}


export default Profile;