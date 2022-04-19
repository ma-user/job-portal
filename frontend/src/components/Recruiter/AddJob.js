import React, {Component} from 'react';
import axios from 'axios';
import { validateFields } from '../Common/Validation';
import classnames from 'classnames';
import "bootstrap/dist/css/bootstrap.min.css"


var clear = '';

export default class AddJob extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
          max_applicants:{
              value: clear,
              validateOnChange:false,
              error: clear
          },
          max_positions:{
              value:clear,
              validateOnChange:false,
              error: clear
          },
          salary:{
              value:clear,
              validateOnChange:false,
              error: clear
          },
          title:{
              value:clear,
              validateOnChange:false,
              error: clear
          },
          deadline:{
              value:clear,
              validateOnChange:false,
              error: clear
          },
          skills:{
              value:clear,
              validateOnChange:false,
              error:clear
          },
          type:"Full-Time", //button
          duration:"0",//button
          submitCalled: false,
          allFieldsValidated: false
        };
        this.email=clear;
        this.recruiter = clear;
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        };

        giveRow(props)
          {
            return (
              props.map(item=>{
                  return <> <input type="radio" value= {item.t} checked={this.state.type === item.t} onChange={this.onChangeType} name="gender" defaultChecked/> {item.t} &nbsp;&nbsp;&nbsp;&nbsp; </>
              })
            )
          }
          onChangeType(event) {
            this.setState({ type: event.target.value });
        }

          giveRow2(props)
          {
            return (
              props.map(item=>{
                  return <> <input type="radio" value= {item.t} checked={this.state.duration === item.t} onChange={this.onChangeDuration} name="gender1" defaultChecked/> {item.t} &nbsp;&nbsp;&nbsp;&nbsp; </>
              })
            )
          }

          onChangeDuration(event) {
            this.setState({ duration: event.target.value });
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
          onSkillsChanged(event){
            this.setState({notes:event.target.value});
        }


        componentDidMount() {
          this.setState({mounted: true});
            axios.get("http://localhost:4000/recruiter/session")
                 .then(res => {
                        const dat = res.data;
                        this.email = dat[0].email;
                        axios.post("http://localhost:4000/recruiter/findone",{
                          email: this.email
                      })
                             .then(res => {
                                var dat = res.data;
                                this.recruiter=dat;
                             })
                             .catch(function(error) {
                               var message = error;
                                 console.log(message);
                             })
                 })
                 .catch(function(error) {
                  var message = error;
                  console.log(message);
                 })
            
            
        }
        
        handleBlur(validationFunc, evt) {
            const fields = {
              field: evt.target.name
            }
            if (this.state[fields.field]['validateOnChange'] === false)
              if(this.state.submitCalled === false)
              {
                this.setState(state => ({
                  [fields.field]: {
                    ...state[fields.field],
                    validateOnChange: true,
                    error: validationFunc(state[fields.field].value)
                  }
                }));
              }
            return;
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
            // validate all fields
            console.log(this.state)
            const title = this.state.title;
            const titleError = validateFields.validateUsername(title.value);
            const deadline = this.state.deadline;
            const deadlineError = validateFields.validateBigDate(deadline.value);
            const salary = this.state.salary;
            const salaryError = validateFields.validateNumber(salary.value);
            const max_positions = this.state.max_positions;
            const max_positionsError = validateFields.validateNumber(max_positions.value);
            const max_applicants = this.state.max_applicants;
            const max_applicantsError = validateFields.validateNumber(max_applicants.value);
            const skills = this.state.skills;
            const skillsError = validateFields.validateUsername(this.state.skills.value);
            if ([titleError, salaryError,max_applicantsError,max_positionsError,deadlineError,skillsError].every(e => e === false)) {
              
          
              var skillarray=this.state.skills.value.split(",");
             
              axios.post('http://localhost:4000/job/addjob', {
                title: this.state.title.value,
                name: this.recruiter.name,
                max_app:this.state.max_applicants.value,
                email: this.email,
                max_pos:this.state.max_positions.value,
                contact_no: this.recruiter.contact_no,
                skills:skillarray,
                salary: this.state.salary.value,
                deadline: this.state.deadline.value,
                job_type:this.state.type,
                duration:this.state.duration
            })
                .then(res => {
                  var message = res.data;  
                  alert(message);
                });

               this.setState({
                salary:clear,
                max_applicants:clear,
                max_positions:clear,
                title:clear,
                deadline:clear,
                skills:clear,
            });
              this.setState({
 
                max_applicants:{
                    value: clear,
                    validateOnChange:false,
                    error: clear
                },
                max_positions:{
                    value:clear,
                    validateOnChange:false,
                    error: clear
                },
                salary:{
                    value:clear,
                    validateOnChange:false,
                    error: clear
                },
                title:{
                    value:clear,
                    validateOnChange:false,
                    error: clear
                },
                deadline:{
                    value:clear,
                    validateOnChange:false,
                    error: clear
                },
                skills:{
                    value:clear,
                    validateOnChange:false,
                    error:clear
                },
                type:"Full-Time", //button
                allFieldsValidated: true,
                duration:"0",//button
                submitCalled: false
              });
              
              this.showAllFieldsValidated();
              
            } else {
              // update the state with errors
              const titlest = {
                ...this.state.title,
                validateOnChange: true,
                error: titleError
              };
              const salaryst = {
                ...this.state.salary,
                validateOnChange: true,
                error: salaryError
              };
              const max_posst = {
                ...this.state.max_positions,
                validateOnChange: true,
                error: max_positionsError
              };
              const max_appst = {
                ...this.state.max_applicants,
                validateOnChange: true,
                error: max_applicantsError
              };
              const deadst = {
                ...this.state.deadline,
                validateOnChange: true,
                error: deadlineError
              };
              const skillst = {
                ...this.state.skills,
                validateOnChange: true,
                error: skillsError
              }

              this.setState({
                title: titlest,
                salary: salaryst,
                max_positions: max_posst,
                max_applicants: max_appst,
                  deadline: deadst,
                  skills: skillst,
              });
            }
          }
        
          showAllFieldsValidated() {
            setTimeout(() => {
              this.setState({ allFieldsValidated: false });
            }, 1500);
          }
        
    
    
    

    render() {
        const { title, deadline,salary,max_applicants,max_positions,skills, allFieldsValidated } = this.state;
        
        const tbox = [
          ["Title: ", "text", "title", this.state.title.value, 
            "Title Of Job", validateFields.validateUsername,
            this.state.title.error
          ],
          ["Maximum Applicants: ", "text", "max_applicants", this.state.max_applicants.value, "Max Applicants Allowed",
            validateFields.validateNumber, this.state.max_applicants.error
          ],
          ["Maximum Positions: ", "text", "max_positions", this.state.max_positions.value, 
            "Max Positions Available", validateFields.validateNumber,
            this.state.max_positions.error
          ],
          ["Salary: ", "text", "salary", this.state.salary.value, 
            "Salary", validateFields.validateNumber,
            this.state.salary.error
          ],
          ["Deadline: ", "text", "deadline", this.state.deadline.value, 
            "Enter deadline in YYYY-MM-DD-HH-mm format", validateFields.validateBigDate,
            this.state.deadline.error
          ],
          ["Required Skills: ", "text", "skills", this.state.skills.value, 
            "Add Skills Required for the Job, separated by commas(,)", validateFields.validateUsername,
            this.state.skills.error
          ],
        ];

        const typel = [{
            t: "Full-Time",
            fun: this.onChangeType
          },
          {
            t: "Part-Time",
            fun: this.onChangeType
          },
          {
            t: "Work From Home",
            fun: this.onChangeType
          }
        ];

        const durl = [
          {
            t: "0",
            fun:this.onChangeDuration
          },
          {
            t: "1",
            fun:this.onChangeDuration
          },
          {
            t: "2",
            fun:this.onChangeDuration
          },
          {
            t: "3",
            fun:this.onChangeDuration
          },
          {
            t: "4",
            fun:this.onChangeDuration
          },
          {
            t: "5",
            fun:this.onChangeDuration
          },
          {
            t: "6",
            fun:this.onChangeDuration
          }
        ]
        return (
            
            <div>
                
                <form onSubmit={evt => this.handleSubmit(evt)}>
                {this.giveForm(tbox)}


                    Type:<br/>
                    <div >
                        {this.giveRow(typel)}
                    </div>
                    <br/>
                    Duration(in months):<br/>
                    <div >
                        {this.giveRow2(durl)}
                    </div>
                    <br/>

                    <button
                type="submit"
                className="btn btn-secondary btn-block"
                onMouseDown={() => { 
                  if(this.state.submitCalled != true){
                    this.setState({ submitCalled: true })
                  }
                }}
              >
                Add Job
              </button>
                </form>
            </div>
        )

       
    }
}