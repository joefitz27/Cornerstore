import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import $ from "jquery";

class HomeComponent extends Component {

    constructor(props) {
        super(props);

        localStorage.setItem('currentUrl', props.location.pathname);
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('admin-token');
        localStorage.removeItem('productPage');
        
        if(localStorage.getItem('hide')) {
            localStorage.removeItem('hide');
            window.location.reload();
        }

        this.state = {
            isRedirect : false,
            searchBox : '',
            fieldErr : false
        }
    }

    componentDidMount() {
        $('#navBar').css('display', 'block');
    }

    navigateToProduct() {
        if(this.state.searchBox) {
            localStorage.setItem('searchText', this.state.searchBox);
            this.setState({
                isRedirect : true
            });
        } else {
            this.setState({
                fieldErr : true
            });
        }
    }

    enterPress(event) {
        if(event.key === 'Enter'){
            this.navigateToProduct();
          }
    }

    fieldChange(event) {
        this.setState({
            searchBox : event.target.value
        });
    }

    render() {
        if(this.state.isRedirect) {
            return <Redirect to="/products"/>;
        }

        return <div className="bg-clr"><br /><br /><br /><br />
            <div className="container">
                <div className="col-lg-12">
                    <div className="text-center">
                        <img src="./images/title.JPG" width="280px"/>
                    </div>
                </div>
                <div className="col-lg-12 text-center">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 mb-4"></div>
                        <div className="col-lg-4 col-md-4 mb-4 text-left">
                            <input type="text" name="search" className={!this.state.fieldErr ? 'form-control' : 'form-control error-input' } onChange={(e)=>this.fieldChange(e)} onKeyPress={(e)=>this.enterPress(e)}/>
                        </div>
                        <div className="col-lg-4 col-md-4 mb-4 text-left">
                            <button type="button" className="btn btn-md btn-danger" onClick={()=>this.navigateToProduct()}>Search</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h5><Link to='/stores' className="text-white">Store List</Link></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    };
}

export default HomeComponent;