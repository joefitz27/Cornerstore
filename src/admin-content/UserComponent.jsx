import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";

import * as url from '../baseUrl';

class UserComponent extends Component {

    constructor(props) {
        super(props);
        
        if(!localStorage.getItem('admin-token') && !localStorage.getItem('adminInfo')) {
            window.location.href = '/admin-sign-in';
        }

        this.state ={
            authorization: 'Basic ' + localStorage.getItem('admin-token'),
            usersList : []
        }
    }

    componentWillMount() {
        this.loadUsers();
    }

    loadUsers() {
        axios({
            method: 'GET',
            url: url.BASE_URL + 'user/all',
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            console.log(response.data)
            this.setState({
                usersList : response.data
            });
        }).catch((error) => {
            if (error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/admin-sign-in';
                    }
                });
            }
        });
    }

    roleChange(data) {
        axios({
            method: 'PUT',
            url: url.BASE_URL + 'user/make-admin',
            headers: { 'authorization': this.state.authorization },
            data : {id : data.user_id, is_admin : !data.is_admin}
        }).then((response) => {
            this.loadUsers();
        }).catch((error) => {
            if (error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/admin-sign-in';
                    }
                });
            }
        });
    }

    removeUser(data) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover user!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios({
                    method: 'DELETE',
                    url: url.BASE_URL + 'user/remove/' + data.user_id,
                    headers: { 'authorization': this.state.authorization }
                }).then((response) => {
                    this.loadUsers();
                }).catch((error) => {
                    if (error.response.status == '403') {
                        swal({
                            title: "Error",
                            text: "You should login",
                            icon: "error",
                            dangerMode: true,
                        }).then(willDelete => {
                            if (willDelete) {
                                window.location.href = '/admin-sign-in';
                            }
                        });
                    }
                });
            }
        });
    }

    render() {
        let users = this.state.usersList.map((data, index)=>{
            return <tr key={index}>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td><a className={data.is_admin ? 'btn btn-sm btn-warning' : 'btn btn-sm btn-info'}>{data.is_admin ? 'YES' : 'NO'}</a></td>
                <td><a className={data.is_admin ? 'btn btn-sm btn-success' : 'btn btn-sm btn-danger'} onClick={()=>this.roleChange(data)}>{!data.is_admin ? 'Mark as admin' : 'Mark as user'}</a></td>
                <td><i className="fa fa-trash text-danger" aria-hidden="true" onClick={()=>this.removeUser(data)}></i></td>
            </tr>
        })

        return <div className="admin-height">
            <div className="container">
                <div className="row">
                    <div className="col-12"><br/><br/><br/><br/>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Is Admin</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default UserComponent;
