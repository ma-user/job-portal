import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { validateFields } from '../Common/Validation';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import classnames from 'classnames';

var clear = '';
var f=false;
class JobCard extends Component{
    // console.log(props);
    constructor(props) {
        super(props);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.state = {
 
            max_applicants:{
                value:this.props.item.max_app,
                validateOnChange:f,
                error: clear
            },
            max_positions:{
                value:this.props.item.max_pos,
                validateOnChange:f,
                error: clear
            },
            deadline:{
                value:this.props.item.deadline,
                validateOnChange:f,
                error: clear
            },
            submitCalled: f,
            allFieldsValidated: f,
            myButton:f
          };
          
        };

        
    handleBlur(validationFunc, evt) {
      const fields = {
        field: evt.target.name
      }
          
            if ( this.state[fields.field]['validateOnChange'] === f)
              if(this.state.submitCalled === f) {
              this.setState(state => ({
                [fields.field]: {
                  ...state[fields.field],
                  validateOnChange: !f,
                  error: validationFunc(state[fields.field].value)
                }
              }));
            }
            return;
          }

          giveRow(props)
          {
            return (
              props.map(item=>{
                  return <> <input type="radio" value= {item.t} checked={this.state.type === item.t} onChange={this.onChangeType} name="gender" defaultChecked/> {item.n} &nbsp;&nbsp;&nbsp;&nbsp; </>
              })
            )
          }

          giveForm(props)
          {
            return(
              props.map(item=>{
              return(<div className="form-group">
                        <label>{item[0]}</label>
                        <input 
                              type= {item[1]}
                              name= {item[2]}
                              value={item[3]}
                              placeholder={item[4]}
                              className={classnames(
                                'form-control',
                                { 'is-valid': item[6] === false },
                                { 'is-invalid': item[6] }
                              )}
                              onChange={evt =>
                                this.handleChange(item[5], evt)
                              }
                              onBlur={evt =>
                                this.handleBlur(item[5], evt)
                              }
                            />
                            <div className="invalid-feedback">{item[6]}</div>
             
              </div>
              )
              })
            )
          }
          handleChange(validationFunc, evt) {
            const fields = {
              field: evt.target.name,
              fieldVal: evt.target.value
            }
            
            this.setState(state => ({
                [fields.field]: {
                ...state[fields.field],
                value: fields.fieldVal,
                error: state[fields.field]['validateOnChange'] ? validationFunc(fields.fieldVal) : ''
                }
            }));
            }
        handleSubmit(evt) {
            evt.preventDefault();
            const deadline=this.state.deadline.value
            const deadlineError = validateFields.validateBigDate(deadline);
            const max_positions=this.state.max_positions.value;
            const max_positionsError = validateFields.validateNumber(max_positions);
            const max_applicants=this.state.max_applicants.value;
            const max_applicantsError = validateFields.validateNumber(max_applicants);
            
            if ([max_applicantsError,max_positionsError,deadlineError].every(e => e === f)) {

             var id=this.props.item._id
              axios.post('http://localhost:4000/job/editjobs', {
                max_app:max_applicants,
                max_pos:max_positions,
                deadline:deadline,
                id:id
            })
                .then(res => {
                    if(max_positions.value <1){
                        this.props.item.applicants.map(userboi => {
                          var id=this.props.item._id
                            axios.post("http://localhost:4000/job/rejectapp",{
                              id: id,
                              email: userboi
                          })
                                .then(res1=>{
                                  var message=res1;
                                  console.log(message)
                                })
                                .catch(function(error){
                                  var message=error;
                                    console.log(message);
                                })
                        });

                        this.props.item.shortlisted.map(userboi => {
                          var email=this.props.user.email
                            if(userboi != email){
                              var id=this.props.item._id
                                axios.post("http://localhost:4000/job/rejectapp",{
                                  id: id,
                                  email: userboi
                              })
                                    .then(res1=>{
                                      var message=res1;
                                      console.log(message)
                                    })
                                    .catch(function(error){
                                      var message=error;
                                      console.log(message);
                                    })
                            }
                        });
                    }
                    window.open("/recruiters/viewjobs","_self");
                });

               this.setState({
                max_applicants:clear,
                max_positions:clear,
                deadline:clear,
            });
              
              this.showAllFieldsValidated();
              
            } else {
              this.setState(state => ({
                max_positions: {
                  ...state.max_positions,
                  validateOnChange: !f,
                  error: max_positionsError
                },
                max_applicants: {
                    ...state.max_applicants,
                    validateOnChange: !f,
                    error: max_applicantsError
                  },
                  deadline: {
                    ...state.deadline,
                    validateOnChange: !f,
                    error: deadlineError
                  },
              }));
            }
          }


          onClickAccept(e){
            e.preventDefault();
            var msg=this.props.item
            this.props.onClickAccept(msg)
           }
    render()
    
    {
      const tbox = [["Application Slots Left", "text", "max_applicants", this.state.max_applicants.value, 
      "Remaining Application Slots", validateFields.validateNumber,
       this.state.max_applicants.error
    ],
["Open Positions Remaining", "text", "max_positions", this.state.max_positions.value, "Max Positions Remaining",
validateFields.validateNumber, this.state.max_positions.error
],
["Deadline", "text", "deadline",this.state.deadline.value, "Enter deadline in YYYY-MM-DD-HH-mm format",
validateFields.validateBigDate, this.state.deadline.error
]
];
var date=this.props.item.date
var title=this.props.item.title
var address='http://localhost:4000/job/deljob'
var id=this.props.item._id
var del="Delete Job"
var width1='18rem'
        return(
          
            <div>
                <Card style={{ width: width1 }}>
                <Card.Body>
                <Button color="primary" onClick={this.onClickAccept}>{title}</Button>
                   
                       <label> Date of posting: {date}</label>
                    <form onSubmit={evt => this.handleSubmit(evt)}>
                    {this.giveForm(tbox)}       
                    <button
                type="submit"
                className="btn btn-secondary btn-block"
                onMouseDown={() =>{ 
                  if(this.state.submitCalled != true){
                    this.setState({ submitCalled: true })
                  }
                }}
              >
                
                <label>Update Details</label>
              </button>
                </form>
                <br/>
                <div className="form-group">
                            <input type="submit" onClick={()=>(
                                                                axios.post(address, {id: id})
                                                                .then(res => {
                                                                                var message=res;
                                                                                window.open("/recruiters/viewjobs","_self");
                                                                            })
                                                                
                                                                )} value={del} className="btn btn-primary"/>
                    </div>
                </Card.Body>
                </Card>
            </div>
        )
    }
}

export default JobCard;