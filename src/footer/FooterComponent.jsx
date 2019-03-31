import React, { Component } from 'react';

class FooterComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isShow : true
        }
    }

    componentWillMount() {
        if(localStorage.getItem('hide')) {
            this.setState({
                isShow : false
            });
        }
    }

    render() {
        return <footer className={this.state.isShow ? 'py-5 bg-info show' : 'hide'}>
            <div className="container">
                <p className="m-0 text-center text-white">Copyright &copy; Cornerstore 2019</p>
            </div>
        </footer>
    }
}

export default FooterComponent;