import React, {Component} from 'react';
import axios from 'axios';
import { validateFields } from './Validation';
import classnames from 'classnames';

var clear = '';
export default class Register extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
          username: {
              value: clear,
              validateOnChange: false,
              error: clear
            },
          email: {
            value: clear,
            validateOnChange: false,
            error: clear
          },
          password: {
            value: clear,
            validateOnChange: false,
            error: clear
          },
          type: 'user',
          submitCalled: false,
          allFieldsValidated: false
        };
        this.f=false
        this.onChangeType = this.onChangeType.bind(this);
        }

        handleBlur(validationFunc, evt) {

          const fields = {
            field: evt.target.name
          }
            if (this.state[fields.field]['validateOnChange'] === this.f)
          if(this.state.submitCalled === this.f)
             {
              this.setState(state => ({
                [fields.field]: {
                  ...state[fields.field],
                  validateOnChange: !this.f,
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
                                { 'is-valid': item[6] === this.f },
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
            const email = this.state.email.value;
            const emailError = validateFields.validateEmail(email);
            const password = this.state.password;
            const passwordError = validateFields.validatePassword(password.value);
            const username = this.state.username;
            const usernameError = validateFields.validateUsername(this.state.username.value);
            const type = this.state.type;
            const em = '';

            if ([emailError, passwordError,usernameError].every(e => e === this.f)) {
            const types = {
              user: "user",
              rec: "recruiter"
            }
            if(type == types.user){
                axios.post('http://localhost:4000/user/register', {
                  email: this.state.email.value,
                  password: password.value,
                  name: this.state.username.value,
                  date: Date.now()
                })
                    .then(res => {
                      console.log(res);
                      if(res.data != 'Error: Account With Given Email Exists')
                      {
                        
                        axios.post('http://localhost:4000/user/session', {
                          email: email
                        })
                          .then(res => {
                            var dat = res.data;
                            console.log(dat);
                          })
                          ;
                       window.open("/users/userprofile","_self");  
                      }
                      else
                      {
                        var ale = res.data;
                        alert(ale);
                      }
                    })
                    ;}
            
            else if(type == types.rec)
            {
                axios.post('http://localhost:4000/recruiter/register', {
                  email: this.state.email.value,
                  password: password.value,
                  name: this.state.username.value,
                  date: Date.now()
                })
                    .then(res => {
                      if(res.data != 'Error: Account With Given Email Exists')
                      {
                        axios.post('http://localhost:4000/recruiter/session', {
                          email: email
                        })
                          .then(res => {
                            var dat = res.data;
                            console.log(dat);
                          });

                       window.open("/recruiters/recruiterprofile","_self");
                        
                      }
                      else
                      {
                        var ale = res.data;
                        alert(ale);
                      }
                    })
                    ;}
            
            this.setState({
                email: em,
                password: em,
                username: em,
            });
              this.setState({
                  username: {
                      value: clear,
                      validateOnChange: this.f,
                      error: clear
                    },
                  email: {
                    value: clear,
                    validateOnChange: this.f,
                    error: clear
                  },
                  password: {
                    value: clear,
                    validateOnChange: this.f,
                    error: clear
                  },
                  type: 'user',
                  submitCalled: this.f,
                  allFieldsValidated: !this.f });
              
              this.showAllFieldsValidated();
            } else {

              const mailst = {
                ...this.state.email,
                validateOnChange: !this.f,
                error: emailError
              };

              const passwordst = {
                ...this.state.password,
                validateOnChange: !this.f,
                error: passwordError
              };

              const usernamest = {
                ...this.state.username,
                validateOnChange: !this.f,
                error: usernameError
              }
              this.setState(state => ({
                email: mailst,
                password: passwordst,
                username: usernamest
              }));
            }
          }
        
         
          showAllFieldsValidated() {
            var num=1500
            setTimeout(() => {
              this.setState({ allFieldsValidated: this.f });
            }, num);
          }

    onChangeType(event) {
        this.setState({ type: event.target.value });
    }

    render() {

      const lvl = [{
          t: "user",
          n: "Applicant"
        },
        {
          t: "recruiter",
          n: "Recruiter"
        }
      ];


      const tbox = [["Username: ", "text", "username", this.state.username.value, 
                      "Enter your username", validateFields.validateUsername,
                       this.state.username.error
                    ],
        ["Email: ", "text", "email", this.state.email.value, "Enter your email",
          validateFields.validateEmail, this.state.email.error
        ],
        ["Password: ", "password", "password", this.state.password.value, "Enter your password",
          validateFields.validatePassword, this.state.password.error
        ]
      ];
      
        return (
            
            <div>
                
                <form onSubmit={evt => this.handleSubmit(evt)}>
                    Role:<br/>
                    <div >
                        {this.giveRow(lvl)}
                    </div>
                    <br/>

                    {this.giveForm(tbox)}
                    <button
                type="submit"
                className="btn btn-secondary btn-block"
                onMouseDown={() =>{ 
                  if(this.state.submitCalled != !this.f){
                    this.setState({ submitCalled: !this.f })
                  }
                }}
              >
                Submit
              </button>
                </form>
            </div>
        )
    }
}