import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import * as url from '../baseUrl';

class StoreComponent extends Component {

    constructor(props) {
        super(props);
        this.state= {
            store: '',
            storeId: localStorage.getItem('storeId')
        }
    }

    componentWillMount() {
        this.loadStoreById();
    }

    loadStoreById() {
        console.log('Hello');
        axios.get(url.BASE_URL + 'store/get/' + this.state.storeId).then((response) => {
            this.setState({
                store: response.data[0]
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return <div><br /><br /><br /><br />
           <div className="row">
           <div className="offset-1 col-3">
                <Link className="btn btn-md btn-danger" to={localStorage.getItem('productPage') ? 'products' : '/'}><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
           </div>
            <div className="col-4">
                <div className="container admin-height">
                    <div className="card">
                        <div className="card-body">
                            <table className="table">
                                <tbody>    
                                    <tr>
                                        <th>Store Name</th>
                                        <td>{this.state.store.store_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Store Address</th>
                                        <td>{this.state.store.store_address}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
           </div>
        </div>
    }
}

export default StoreComponent;