import React, { Component } from 'react';
import { Redirect } from 'react-router';
import $ from "jquery";

class HomeComponent extends Component {

    constructor(props) {
        super(props);

        localStorage.setItem('currentUrl', props.location.pathname);
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('admin-token');
        
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

    fieldChange(event) {
        this.setState({
            searchBox : event.target.value
        });
    }

    render() {
        if(this.state.isRedirect) {
            return <Redirect to="/products"/>;
        }

        return <div className="bg-clr"><br /><br /><br /><br /><br />
            <div className="container">
                <div className="col-lg-12">
                    <div className="text-center">
                        <h1 className="text-uppercase">Cornerstore</h1>
                    </div>
                </div>
                <div className="col-lg-12 text-center">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 mb-4"></div>
                        <div className="col-lg-4 col-md-4 mb-4 text-left">
                            <input type="text" name="search" className={!this.state.fieldErr ? 'form-control' : 'form-control error-input' } onChange={(e)=>this.fieldChange(e)}/>
                        </div>
                        <div className="col-lg-4 col-md-4 mb-4 text-left">
                            <button type="button" className="btn btn-md btn-danger" onClick={()=>this.navigateToProduct()}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    };
}

export default HomeComponent;