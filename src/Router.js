import React, { Component } from 'react';
import { Router , Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'antd';

import Login from './module/login/';
import PDF from './module/login/PDF';
import Customer from './module/customer/';
import CustomerInfo from './module/customer/CustomerInfo';

export default class Routers extends Component {
  constructor(props){
    super(props);
    this.state={}
  }
  render() {
    return (
      <Router history={this.props.history}>
        <Switch>
          <Route exact path='/' component={ Login } />
          <Route path='/login' component={ Login } />
          <Route path='/pdf' component={ PDF } />
          <Route exact path='/customer' component={ Customer } />
          <Route exact path='/customer/:id' component={ CustomerInfo } />
        </Switch>
      </Router>
    )
  }
}