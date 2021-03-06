import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";

import * as url from '../baseUrl';

class ResgisterComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            errEmail: false,
            password: '',
            errPwd: false,
            name: '',
            errName: false,
            isRegistred: false,
            isEmailExist: false,
            storeName: '',
            errStoreName: false,
            storeAddress: '',
            errStoreAddress: false

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

            this.checkEmail(val);
        }

        if(fieldName === 'pwd') {
            this.setState({
                password : val
            });
        }

        if(fieldName === 'name') {
            this.setState({
                name : val
            });
        }

        if(fieldName === 'storeName') {
            this.setState({
                storeName: val
            });
        }

        if(fieldName === 'storeAddress') {
            this.setState({
                storeAddress: val
            });
        }
    }

    checkEmail(email) {
        axios.get(url.BASE_URL + 'user/check/' + email).then((response)=> {
            this.setState({
                isEmailExist : false
            });
        }).catch((error)=> {
            this.setState({
                isEmailExist : true
            });
        });
    }

    register() {
        if(!this.state.name) {
            this.setState({
                errName : true
            });
        } else {
            this.setState({
                errName : false
            });
        }

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

        if(!this.state.storeName) {
            this.setState({
                errStoreName : true
            });
        } else {
            this.setState({
                errStoreName : false
            });
        }

        if(!this.state.storeAddress) {
            this.setState({
                errStoreAddress : true
            });
        } else {
            this.setState({
                errStoreAddress : false
            });
        }

        if(this.state.name && this.state.email && this.state.password && !this.state.isEmailExist && this.state.storeName && this.state.storeAddress) {
            var data = {
                name : this.state.name,
                email : this.state.email,
                password : this.state.password
            }

            axios.post(url.BASE_URL + 'user/create', data).then((response)=> {
                this.createStore(response.data.id);
            }).catch((error)=> {
                console.log(error);
                swal({
                    title: "Failed",
                    text: "Something went wrong",
                    icon: "error"
                });
            });
        }
    }

    createStore(userId) {
        var storeData = {
            user_id : userId,
            store_name : this.state.storeName,
            store_address : this.state.storeAddress
        }
        axios.post(url.BASE_URL + 'store/create', storeData).then((resp)=> {
            swal({
                title: "Registered",
                text: "Successfully Registered",
                icon: "success"
            }).then(willDelete => {
                if (willDelete) {
                    this.setState({
                        isRegistred : true
                    });
                }
            });
        });
    }

    render() {
        if(this.state.isRegistred) {
            return <Redirect to="/sign-in"/>;
        }

        return <div className="bg-sign-in">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-4"></div>
                <div className="col-lg-4 col-md-4"><br /><br /><br />
                    <div className="panel panel-default shadow p-3 mb-5 bg-clr-prd rounded">
                        <div className="panel-heading text-center">
                            <h2>Register</h2>
                        </div>
                        <div className="panel-body text-center">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className={!this.state.errName ? 'form-control bg-input' : 'form-control err-input-bg'} onChange={(e)=>this.fieldChange(e, 'name')} id="name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="storeName">Store Name</label>
                                    <input type="text" className={!this.state.errStoreName ? 'form-control bg-input' : 'form-control err-input-bg'} onChange={(e)=>this.fieldChange(e, 'storeName')} id="storeName"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="storeAddress">Store Address</label>
                                    <input type="text" className={!this.state.errStoreAddress ? 'form-control bg-input' : 'form-control err-input-bg'} onChange={(e)=>this.fieldChange(e, 'storeAddress')} id="storeAddress"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className={!this.state.errEmail ? 'form-control bg-input' : 'form-control err-input-bg'} onChange={(e)=>this.fieldChange(e, 'email')} id="email" />
                                    <span className={this.state.isEmailExist ? 'text-danger show' : 'hide'}>This email already used</span>
                                </div>
                                <div className="form-group">
                                    <label for="pwd">Password</label>
                                    <input type="password" className={!this.state.errPwd ? 'form-control bg-input' : 'form-control err-input-bg'} onChange={(e)=>this.fieldChange(e, 'pwd')} id="pwd" />
                                </div>
                                <button type="button" className="btn btn-default" style={{border : '1px solid black'}} onClick={()=>this.register()}>Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    }
}

export default ResgisterComponent;