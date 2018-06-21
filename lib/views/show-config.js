'use babel';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ShowConfig extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="status-bar-settings">
        <span className="icon-gear"/> Config
      </div>
    );
  }
}
