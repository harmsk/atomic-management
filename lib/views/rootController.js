'use babel';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ShowConfig from './showConfig.js';
import StatusBar from './statusBar.js';

export default class RootController extends Component {

    static propTypes = {
        statusBar: PropTypes.object,
        tooltips: PropTypes.object,
    }

    render() {
        return (
            <StatusBar
            statusBar={this.props.statusBar}
            tooltips={this.props.tooltips}>
                <ShowConfig/>
            </StatusBar>
        )
    }
}
