import React, { Component } from 'react';
import {observer} from 'mobx-react';

@observer
class NotFound extends Component {
  render() {
    return (
      <div className="not_found">
        <span>няма страницы</span>
      </div>
    );
  }
}

export default NotFound;