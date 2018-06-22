'use babel';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ShowConfig extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: Show number of active configuration files. ex: (2)
    return(
      <div id="status-bar-settings">
        <span className="icon-gear"/> Config
      </div>
    );
  }
}
