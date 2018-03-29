import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import action from '../../action'

import { Button } from 'antd'

import logo from './logo.svg';
import './index.less';

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  pdf = () => {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>
          这里是登陆
        </p>
        <Button onClick={this.pdf}>点我点我</Button>  
      </div>
    ); 
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLogin: bindActionCreators(action.fetchLogin, dispatch)
  }  
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
