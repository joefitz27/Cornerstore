import React, { Component } from 'react';

import HeaderComponent from './header/HeaderComponent.jsx';
import FooterComponent from './footer/FooterComponent.jsx';

class LayoutComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderComponent/>
                    {this.props.children}
                <FooterComponent/>
            </div>
        )
    }
}

export default LayoutComponent;