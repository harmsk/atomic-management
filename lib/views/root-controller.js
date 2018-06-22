'use babel';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ShowConfig from './show-config.js';
import StatusBar from './status-bar.js';

export default class RootController extends Component {

  static propTypes = {
    statusBar: PropTypes.object.isRequired,
    tooltips: PropTypes.object.isRequired,
    onReorder: PropTypes.func.isRequired,
    onCheck: PropTypes.func.isRequired,
    projectConfigs: PropTypes.array.isRequired,
    disabledConfigs: PropTypes.array.isRequired
  }

  render() {
    return (
      <StatusBar
        projectConfigs={this.props.projectConfigs}
        disabledConfigs={this.props.disabledConfigs}
        statusBar={this.props.statusBar}
        tooltips={this.props.tooltips}
        onReorder={this.props.onReorder}
        onCheck={this.props.onCheck}
        menuRef={this.props.menuRef}>
        <ShowConfig/>
      </StatusBar>
    )
  }
}
