import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import action from '../../action'

import { Button } from 'antd'

import FDF from './PDF'
import logo from './logo.svg';
import './index.less';

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Button onClick={()=>{this.props.history.push('/pdf')}}>预览PDF</Button>  
        
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
