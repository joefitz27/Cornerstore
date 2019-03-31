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
            userName : localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')).name : ''
        }
    }

    componentWillMount() {
        if(this.state.searchBox) {
            this.searchByWord();
        } else {
            this.searchAll();
        }
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

    searchByWord() {
        axios.get(url.BASE_URL + 'product/search/' + this.state.searchBox).then((response) => {
            this.setState({
                products: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    searchAll() {
        axios.get(url.BASE_URL + 'product/all').then((response) => {
            this.setState({
                products: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        let productList = this.state.products.map((data, index) => {
            var imageUrl = url.IMAGE_URL + data.product_id + '.jpg';
            return <div className="col-lg-3 col-md-6 mb-4" key={index}>
                <div className="card h-100">
                    <a href="javascript:void(0);" style={{'height' : '120px'}}><img className="card-img-top" height="110%" src={imageUrl} alt="" /></a>
                    <div className="card-body">
                        <h6 className="card-title">
                            <a href="javascript:void(0);">Name: {data.name}</a>
                        </h6>
                        <p className="card-text">{data.description}</p>
                        <h6>Cost: {data.cost}</h6>
                    </div>
                </div>
            </div>
        })

        return <div>
            <div className="bg-clr-prd"><br /><br /><br />
                <div className="row">
                    <div className="col-lg-4 col-md-4 mb-4 text-center">
                        <h4 className={this.state.userName ? 'show' : 'hide'}>{this.state.userName}'s Market</h4>
                    </div>
                    <div className="col-lg-4 col-md-4 mb-4 text-left">
                        <input type="text" name="search" className="form-control" value={this.state.searchBox} onChange={(e)=>this.fieldChange(e)}/>
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
                <div  className={this.state.products.length == 0 && !this.state.userName ? 'row show' : 'hide'}>
                    <div className="col-12 text-center text-success">
                        <h3>Sigin to add products</h3><br />
                    </div>
                </div>
                <div  className={this.state.products.length == 0 && this.state.userName ? 'row show' : 'hide'}>
                    <div className="col-12 text-center text-success">
                        <h3>Add products</h3><br />
                    </div>
                </div>
            </div>
        </div>

    };
}

export default ProductComponent;