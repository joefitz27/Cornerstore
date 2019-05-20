import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

import * as url from '../baseUrl';

class CategoryComponent extends Component {

    constructor(props) {
        super(props);

        if(!localStorage.getItem('admin-token') && !localStorage.getItem('adminInfo')) {
            window.location.href = '/admin-sign-in';
        }

        this.state = {
            authorization: 'Basic ' + localStorage.getItem('admin-token'),
            userData: JSON.parse(localStorage.getItem('adminInfo')),
            category_name : '',
            categoryList: [],
            errName: false,
            catId: '',
            isEdit: false
        }
    }

    componentWillMount() {
        this.loadCategory();
    }

    loadCategory() {
        axios({
            method: 'GET',
            url: url.BASE_URL + 'category/all'
        }).then((response) => {
            this.setState({
                categoryList : response.data
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

    fieldChange(event, fieldName) {
        var val = event.target.value;
        if(fieldName === 'category_name') {
            this.setState({
                category_name : val
            });
        }
    }

    save() {
        if(!this.state.category_name) {
            this.setState({
                errName : true
            });
        } else {
            this.setState({
                errName : false
            });
        }

        if(this.state.category_name) {
            var data = {
                category_name : this.state.category_name,
                created_by : this.state.userData.id
            }
            axios({
                method: 'POST',
                url: url.BASE_URL + 'category/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.cancel();
                this.loadCategory();
            }).catch((error) => {
                if (error.response.status === '403') {
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
    }

    edit(id, catName) {
        this.setState({
            catId : id,
            isEdit : true,
            category_name : catName
        });
    }

    update() {
        if(!this.state.category_name) {
            this.setState({
                errName : true
            });
        } else {
            this.setState({
                errName : false
            });
        }

        if(this.state.category_name) {
            var data = {
                id : this.state.catId,
                category_name : this.state.category_name,
                created_by : this.state.userData.id
            }
            axios({
                method: 'PUT',
                url: url.BASE_URL + 'category/update',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.cancel();
                this.loadCategory();
            }).catch((error) => {
                if (error.response.status === '403') {
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
    }

    cancel() {
        this.setState({
            isEdit : false,
            category_name : ''
        });
    }

    delete(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover category!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios({
                    method: 'DELETE',
                    url: url.BASE_URL + 'category/remove/' + id,
                    headers: { 'authorization': this.state.authorization }
                }).then((response) => {
                    this.loadCategory();
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

        const categories = this.state.categoryList.map((data, index) => {
            return <tr key={index}>
                <td>{(index+1)}</td>
                <td>{data.category_name}</td>
                <td><i className="fa fa-edit text-warning" onClick={()=>this.edit(data.category_id, data.category_name)}></i></td>
                <td><i className="fa fa-trash text-danger" onClick={()=>this.delete(data.category_id)}></i></td>
            </tr>
        });

        return <div className="admin-height">
        <div className="container"><br/><br/><br/><br/>
            <div className="row">
                <div className="col-10">
                    <h5>Category</h5>
                </div>
                <div className="col-2">
                    <Link className="btn-success btn-md btn" to='/admin-view'>User</Link>
                </div>
            </div>
            <div className="row">
                <div className="col-4"></div>
                <div className="col-4">
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Category Name</label>
                            <input type="text" className={!this.state.errName ? 'form-control' : 'form-control error-input'} onChange={(e)=>this.fieldChange(e, 'category_name')} value={this.state.category_name} id="name"/>
                        </div>
                    </form>
                </div>
            </div>
            <div className={this.state.isEdit? 'show' : 'hide'}>
                <div className="row">
                    <div className="offset-4 col-2">
                        <button type="button" className="btn btn-warning btn-sm" onClick={()=>this.update()}>Update</button>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-success btn-sm" onClick={()=>this.cancel()}>Cancel</button>
                    </div>
                </div>
            </div>
            <div className={this.state.isEdit? 'row hide' : 'row show'}>
                <div className="offset-4  col-6">
                    <button type="button" className="btn btn-success btn-sm" onClick={()=>this.save()}>Save</button>
                </div>
            </div>
            <div className="row" className={this.state.categoryList.length==0 ? 'hide' : 'show'}>
                <div className="offset-4 col-4"><br/>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Sl no.</th>
                                    <th>Category Name</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>;
    }
}

export default CategoryComponent;