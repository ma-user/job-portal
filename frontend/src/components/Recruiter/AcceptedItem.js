
import React, {Component} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import 'alertifyjs/build/css/alertify.css';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';



class AcceptedItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating:'',           
        };
        this.onClickRate=this.onClickRate.bind(this)
        this.rate_me=''
    }
   
    onClickRate(){
       var message;
       var email=this.props.email;
       var id = this.props.user.id;
       var rating = this.state.rating; 
        axios.post("http://localhost:4000/user/rateuser",{
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
        console.log(message);
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

            function OptionReturn(props){
                return(
                    props.map(item=>{
                            return( <option value={item}>{item}</option>)
                    })
                )
            }
            this.rate_me=<div>
                            <select name="rating" onChange={this.handleRatingChange}>
                            {OptionReturn(["1","2","3","4","5"])}
                            </select> 
                            <Button  size='small' onClick={this.onClickRate}>Submit Rating</Button>
                            </div>
                var wtf=this.props.user.has_rated;
                wtf.map(item =>{
                    var email=this.props.email;
                    var rating=item.rating;
                    if(item.email===email)
                    {
                        this.rate_me=rating;
                    }
                })

            return(
                <TableRow key={this.props.user._id}>
                    <TableCell align="left">{this.props.user.name}</TableCell>
                    {this.giveRow([this.props.user.title,this.props.user.doj,this.props.user.type,this.props.user.rating,this.rate_me])}
                </TableRow>
            )
        }
    }

export default AcceptedItem;