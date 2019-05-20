import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";

import * as url from '../baseUrl';

class SigninComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email : '',
            errEmail : false,
            password : '',
            errPwd : false
        }
    }

    componentDidMount() {
        $('#navBar').css('display', 'none');
    }

    fieldChange(event, fieldName) {
        var val = event.target.value;
        if(fieldName === 'email') {
            this.setState({
                email : val
            });
        }

        if(fieldName === 'pwd') {
            this.setState({
                password : val
            });
        }
    }

    signIn() {
        if(!this.state.email) {
            this.setState({
                errEmail : true
            });
        } else {
            this.setState({
                errEmail : false
            });
        }

        if(!this.state.password) {
            this.setState({
                errPwd : true
            });
        } else {
            this.setState({
                errPwd : false
            });
        }

        if(this.state.email && this.state.password) {
            var data = {
                email : this.state.email,
                password : this.state.password
            }
            axios.post(url.BASE_URL + 'user/login', data).then((response)=> {
                localStorage.setItem('info', JSON.stringify(response.data.info));
                localStorage.setItem('token', response.headers['x-token']);
                window.location.href = localStorage.getItem('currentUrl');
            }).catch((error)=> {
                swal({
                    title: "Login Failed",
                    text: "Email or password incorrect",
                    icon: "error"
                });
            });
        }
    }

    render() {
        return <div className="bg-sign-in">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-4"></div>
                    <div className="col-lg-4 col-md-4"><br /><br /><br />
                        <div className="panel panel-default shadow p-3 mb-5 bg-clr-prd rounded">
                            <div className="panel-heading text-center">
                                <h2>Sign In</h2>
                            </div>
                            <div className="panel-body text-center">
                                <form action="/action_page.php">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className={!this.state.errEmail ? 'form-control bg-input' : 'form-control err-input-bg'} id="email" onChange={(e)=>this.fieldChange(e, 'email')}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="pwd">Password</label>
                                        <input type="password" className={!this.state.errPwd ? 'form-control bg-input' : 'form-control err-input-bg'} id="pwd"  onChange={(e)=>this.fieldChange(e, 'pwd')}/>
                                    </div>
                                    <button type="button" className="btn btn-default" style={{border : '1px solid black'}} onClick={()=>this.signIn()}>Sign In</button><br/><br/>
                                    <Link to="/register" style={{color : 'black'}}>Register</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SigninComponent;