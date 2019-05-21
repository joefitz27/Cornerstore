import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";

import * as url from '../baseUrl';

class ProductComponent extends Component {

    constructor(props) {
        super(props);
        
        localStorage.setItem('currentUrl', props.location.pathname);
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('admin-token');

        this.state = {
            searchBox : localStorage.getItem('searchText'),
            products : [],
            storeName : '',
            storeAddress : '',
            userInfo : JSON.parse(localStorage.getItem('info')),
            userName : localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')).name : ''
        }
    }

    componentWillMount() {
        if(this.state.userInfo) {
            this.userStoreDetails();
        }
        if(this.state.searchBox) {
            this.searchByWord();
        } else {
            this.searchAll();
        }
    }

    userStoreDetails() {
        axios.get(url.BASE_URL + 'store/get/user/' + this.state.userInfo.id).then((response) => {
            this.setState({
                storeName: response.data[0].store_name,
                storeAddress: response.data[0].store_address
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        $('#navBar').css('display', 'block');
    }

    fieldChange(event) {
        localStorage.setItem('searchText', event.target.value);
        this.setState({
            searchBox : event.target.value
        });
    }

    search() {
        if(this.state.searchBox) {
            localStorage.setItem('searchText', this.state.searchBox);
            this.setState({
                isRedirect : true
            });

            this.searchByWord();
        } else {
            this.setState({
                fieldErr : true
            });

            this.searchAll();
        }
    }

    enterPress(event) {
        if(event.key === 'Enter'){
            this.search();
          }
    }

    searchByWord() {
        axios.get(url.BASE_URL + 'product/search/' + this.state.searchBox).then((response) => {
            console.log(response.data);
            this.setState({
                products: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    searchAll() {
        axios.get(url.BASE_URL + 'product/all').then((response) => {
            console.log(response.data);
            this.setState({
                products: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    goToStore(storeId) {
        localStorage.setItem('storeId', storeId);
        localStorage.setItem('productPage', 'prductPage');
        window.location.href = '/store';
    }


    render() {
        let productList = this.state.products.map((data, index) => {
            var imageUrl = url.IMAGE_URL + data.product_id + '.jpg';
            return <div className="col-lg-3 col-md-6 mb-4" key={index}>
                <div className="card h-100">
                    <a href="javascript:void(0);" style={{'height' : '170px'}}><img className="card-img-top" height="110%" src={imageUrl} alt="" /></a>
                    <div className="card-body">
                        <h6 className="card-title">
                            <a href="javascript:void(0);">{data.name}</a>
                        </h6>
                        <h6 className="card-title">
                            <a href="javascript:void(0);">{data.description}</a>
                        </h6>
                        <span>${data.cost}</span>
                        <p><a href="javascript:void(0);" onClick={()=>this.goToStore(data.store_id)}>{data.store_name}</a></p>
                    </div>
                </div>
            </div>
        })

        return <div>
            <div className="bg-clr-prd"><br /><br /><br /><br />
                <div className="row">
                    <div className="col-lg-4 col-md-4 mb-4 text-center">
                        <h6 className={this.state.userName ? 'show' : 'hide'}>{this.state.storeName}<br/>{this.state.storeAddress}</h6>
                    </div>
                    <div className="col-lg-4 col-md-4 mb-4 text-left">
                        <input type="text" name="search" className="form-control" value={this.state.searchBox} onChange={(e)=>this.fieldChange(e)} onKeyPress={(e)=>this.enterPress(e)}/>
                    </div>
                    <div className="col-lg-4 col-md-4 mb-4 text-left">
                        <button type="button" className="btn btn-md btn-danger" onClick={() => this.search()}>Search</button>
                    </div>
                </div>
            </div><br />
            <div className="container admin-height">
                <div className={this.state.products.length > 0 ? 'show' : 'hide'}>
                    <div className="row">
                        {productList}<br/><br/>
                    </div>
                </div>
                <div  className={this.state.products.length === 0 && !this.state.userName ? 'row show' : 'hide'}>
                    <div className="col-12 text-center text-success">
                        <h3>Sigin to add products</h3><br />
                    </div>
                </div>
                <div  className={this.state.products.length === 0 && this.state.userName ? 'row show' : 'hide'}>
                    <div className="col-12 text-center text-success">
                        <h3>Add products</h3><br />
                    </div>
                </div>
            </div>
        </div>
    };
}

export default ProductComponent;