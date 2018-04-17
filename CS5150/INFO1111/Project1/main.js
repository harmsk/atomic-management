import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';


class DisplayBox extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="" style={{display: 'flex', justifyContent: 'center'}}>
      This way my finished projcet from 2017 look at me
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayBox);
