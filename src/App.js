import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LayoutComponent from './LayoutComponent.jsx';
import SigninComponent from './Signin-Register/SigninComponent';
import AdminSigninComponent from './Signin-Register/AdminSigninComponent';
import ResgisterComponent from './Signin-Register/ResgisterComponent';
import HomeComponent from './public-content/HomeComponent';
import ProductComponent from './public-content/ProductComponent';
import UserComponent from './admin-content/UserComponent';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <LayoutComponent>
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route path="/products" component={ProductComponent} />
            <Route path="/sign-in" component={SigninComponent} />
            <Route path="/register" component={ResgisterComponent} />
            <Route path="/admin-sign-in" component={AdminSigninComponent} />
            <Route path="/admin-view" component={UserComponent} />
          </Switch>
        </LayoutComponent>
      </BrowserRouter>
    );
  }
}

export default App;
