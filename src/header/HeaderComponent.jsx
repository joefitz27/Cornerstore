import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios';
import swal from 'sweetalert';

import * as url from '../baseUrl';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor : '#17a2b8'
    }
};

class HeaderComponent extends Component {

    constructor(props) {
        super(props);

        var isSignin = false;
        if(localStorage.getItem('info') && localStorage.getItem('token')) {
            isSignin = true;
        }

        var isAdmin = false;
        if(localStorage.getItem('adminInfo') && localStorage.getItem('admin-token')) {
            isAdmin = true;
        }

        this.state = {
            authorization: 'Basic ' + localStorage.getItem('token'),
            usrInfo: JSON.parse(localStorage.getItem('info')),
            isShow : true,
            modalIsOpen: false,
            viewImage : '',
            isSignIn : isSignin,
            isAdmin : isAdmin,
            name : '',
            errName : false,
            description : '',
            errDesc : false,
            cost : '',
            errCost : false,
            imageData : '',
            errImg : false
        }

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillMount() {
        if(localStorage.getItem('hide')) {
            this.setState({
                isShow : false
            });
        } else {
            this.setState({
                isShow : true
            });
        }
    }

    openModal() {
        this.setState({modalIsOpen: true});
      }
     
      afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = '#f00';
      }
     
      closeModal() {
        this.setState({modalIsOpen: false});
      }

    hideFooterHeader() {
        localStorage.setItem('hide', 'hide');
        localStorage.setItem('reload', 'reload');
    }

    logout() {
        localStorage.removeItem('info');
        localStorage.removeItem('token');
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('admin-token');
        window.location.href = localStorage.getItem('currentUrl') ? localStorage.getItem('currentUrl') : '/';
    }

    changeImage(event) {
        var image = event.target.files[0];
        console.log(image);
        if(image.name.indexOf('.png') != -1 || image.name.indexOf('.jpg') != -1 || image.name.indexOf('.jpeg') != -1 || image.name.indexOf('.PNG') != -1 || image.name.indexOf('.JPG') != -1 || image.name.indexOf('.JPEG') != -1) { 
            this.setState({
                viewImage: URL.createObjectURL(image),
                imageData: image
            });
        } else {
            swal("Oops!", "Select .png, .jpg or .jpeg file only", "error");
        }
    }

    fieldChange(event, fieldName) {
        var val = event.target.value;
        if(fieldName == 'cost') {
            this.setState({
                cost : val
            });
        }

        if(fieldName == 'desc') {
            this.setState({
                description : val
            });
        }

        if(fieldName == 'name') {
            this.setState({
                name : val
            });
        }
    }

    save() {
        if(!this.state.name) {
            this.setState({
                errName : true
            });
        } else {
            this.setState({
                errName : false
            });
        }

        if(!this.state.description) {
            this.setState({
                errDesc : true
            });
        } else {
            this.setState({
                errDesc : false
            });
        }

        if(!this.state.cost) {
            this.setState({
                errCost : true
            });
        } else {
            this.setState({
                errCost : false
            });
        }

        if(!this.state.imageData) {
            this.setState({
                errImg : true
            });
        } else {
            this.setState({
                errImg : false
            });
        }

        if(this.state.name && this.state.description && this.state.cost && this.state.imageData) {
            var data = {
                name : this.state.name,
                description : this.state.description,
                cost : this.state.cost,
                created_by : this.state.usrInfo.id
            }

            axios({
                method: 'POST',
                url: url.BASE_URL + 'product/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {

                this.uploadPicture(response.data.id);
                swal({
                    title: "Great!",
                    text: "Item added Successfully",
                    icon: "success",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                       window.location.reload(true);
                    }
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
                            window.location.href = '/sign-in';
                        }
                    });
                }
            });
        }
    }

    uploadPicture(id) {
        if (this.state.imageData) {
            var data = this.state.imageData;

            var formData = new FormData();
            var imagefile = data;
            formData.append('product_image', imagefile);
            axios.post(url.BASE_URL + 'image/upload/image/' + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': this.state.authorization
                }
            })
        }
    }

    render() {
        return <div>
        <nav id="navBar" className="navbar navbar-expand-lg navbar-dark bg-info fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/"><b>Cornerstore</b></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                        <li className={(!this.state.isSignIn && !this.state.isAdmin) ? 'nav-item show' : 'nav-item hide'}>
                            <Link className="nav-link" to="/sign-in" onClick={()=>this.hideFooterHeader()}><b>Sigin</b></Link>
                        </li>
                        <li className={(!this.state.isSignIn && !this.state.isAdmin)? 'nav-item show' : 'nav-item hide'}>
                            <Link className="nav-link" to="/register" onClick={()=>this.hideFooterHeader()}><b>Register</b></Link>
                        </li>
                        <li className={(this.state.isSignIn && !this.state.isAdmin) ? 'nav-item show' : 'nav-item hide'}>
                            <a href="javascript:void(0);" className="nav-link" onClick={this.openModal}><b><i className="fa fa-plus" aria-hidden="true"></i> Add</b></a>
                        </li>
                        <li className={(this.state.isSignIn || this.state.isAdmin) ? 'nav-item show' : 'nav-item hide'}>
                            <a href="javascript:void(0);" className="nav-link" onClick={()=>this.logout()}><b>Sign Out</b></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <div className="row">
            <div className="col-12 text-center">
                <h2>New Item</h2><br/>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-6 text-center">
                        <div className="col-12">
                            <img src={this.state.viewImage} height="100px" width="120px"/>
                        </div>
                        <div className="col-12"><br/>
                            <div className="file btn btn-sm btn-info file-div" style={{border : '1px solid black'}}> Select Image
                                <input type='file' className="file-input" id="imageUpload" accept=".png, .jpg, .jpeg" onChange={(e)=>this.changeImage(e)}/>
                            </div>
                            <span className={this.state.errImg ? 'text-danger show' : 'hide'}>Select image</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <form>
                            <div className="form-group">
                                <input type="text" id="name" placeholder="Name" className={!this.state.errName ? 'form-control' : 'form-control error-input'} onChange={(e)=>this.fieldChange(e, 'name')}/>
                            </div>
                            <div className="form-group">
                                <textarea id="description" placeholder="Description" className={!this.state.errDesc ? 'form-control' : 'form-control error-input'} onChange={(e)=>this.fieldChange(e, 'desc')}></textarea>
                            </div>
                            <div className="form-group">
                                <input type="number" className="form-control" id="name" placeholder="Cost" className={!this.state.errCost ? 'form-control' : 'form-control error-input'} onChange={(e)=>this.fieldChange(e, 'cost')}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-12 text-right">
                <button type="button" className="btn btn-lg btn-default" onClick={()=>this.save()}><b>Add</b></button><br/><br/>
            </div>
        </div>
        </Modal>
        </div>
    }
}

export default HeaderComponent;