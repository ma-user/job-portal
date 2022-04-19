import React, {Component} from 'react';
import axios from 'axios';
import { validateFields } from './Validation';
import classnames from 'classnames';
import "bootstrap/dist/css/bootstrap.min.css"

var clear = '';


export default class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
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
            const password = this.state.password.value;
            const passwordError = validateFields.validatePassword(password);
            const type = this.state.type;

            if ([emailError, passwordError].every(e => e === this.f)) {
              const types = {
                user: "user",
                rec: "recruiter"
              }
              if(type==types.user){
                  console.log("ok user");
                  axios.post('http://localhost:4000/user/login', {
                    email: email,
                    password: password,
                })
                      .then(res => {
                        if(res.data==='Success')
                        {
                          axios.post('http://localhost:4000/user/session', {
                            email: email
                          })
                            .then(res => {console.log(res.data)})
                            ;

                          window.open("/users/userprofile","_self");                  
                        }
                        else
                          alert( res.data);console.log(res.data);
                      })
                      ;}
            
                else if(type == types.rec)
                {
                    axios.post('http://localhost:4000/recruiter/login', {
                      email: email,
                      password: password,
                  })
                    .then(res => {
                      if(res.data==='Success')
                      {
                        axios.post('http://localhost:4000/recruiter/session', {
                          email: email
                        })
                          .then(res => {console.log(res.data)})
                          ;

                        window.open("/recruiters/recruiterprofile","_self");
                      }
                      else
                        alert( res.data);console.log(res.data);
                    })
                    ;}
    
            this.setState({
                email: clear,
                password: clear,
            });

              this.setState({
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
                allFieldsValidated: !this.f
              });
              
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

              this.setState(state => ({
                email: mailst,
                password: passwordst
              }));
            }
          }
        
          showAllFieldsValidated() {
            setTimeout(() => {
              this.setState({ allFieldsValidated: this.f });
            }, 1500);
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

      const tbox = [
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