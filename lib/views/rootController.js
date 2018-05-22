'use babel';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ShowConfig from './showConfig.js';
import StatusBar from './statusBar.js';

export default class RootController extends Component {

    static propTypes = {
        statusBar: PropTypes.object.isRequired,
        tooltips: PropTypes.object.isRequired,
        onReorder: PropTypes.func.isRequired,
        enabledConfigs: PropTypes.array.isRequired,
        onCheck: PropTypes.func.isRequired,
        projectConfigs: PropTypes.array.isRequired
    }

    render() {
        return (
            <StatusBar
            statusBar={this.props.statusBar}
            tooltips={this.props.tooltips}
            onReorder={this.props.onReorder}
            enabledConfigs={this.props.enabledConfigs}
            onCheck={this.props.onCheck}
            projectConfigs={this.props.projectConfigs}
            menuRef={this.props.menuRef}>
                <ShowConfig/>
            </StatusBar>
        )
    }
}
