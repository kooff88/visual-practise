import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import action from '../../action'

class Customer extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  render() {
    return (
      <div className="customer">
        这个是customer页面
      </div>
    ); 
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(Customer);
