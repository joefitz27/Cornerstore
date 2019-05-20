import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import * as url from '../baseUrl';

class StoreListComponent extends Component {

    constructor(props) {
        super(props);
        localStorage.removeItem('productPage');
        this.state= {
            store: [],
            storeId: localStorage.getItem('storeId')
        }
    }

    componentWillMount() {
        this.loadStoreById();
    }

    loadStoreById() {
        console.log('Hello');
        axios.get(url.BASE_URL + 'store/all').then((response) => {
            this.setState({
                store: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    goToStore(storeId) {
        localStorage.setItem('storeId', storeId);
        window.location.href = '/store';
    }

    render() {

        let stores = this.state.store.map((data, index) => {
            return  <tr key={index} className='mouse-pointer' onClick={()=>this.goToStore(data.store_id)}>
                <td>{data.store_name}</td>
                <td>{data.store_address}</td>
            </tr>
        });

        return <div><br /><br /><br /><br />
           <div className="row">
           <div className="offset-1 col-3">
                <Link className="btn btn-md bg-yellow" to='/'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
           </div>
            <div className="col-4">
                <div className="container admin-height">
                    <div className="card">
                        <div className="card-body">
                            <table className="table table-striped">
                                <thead>    
                                    <tr>
                                        <th>Store Name</th>
                                        <th>Store Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stores}
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

export default StoreListComponent;