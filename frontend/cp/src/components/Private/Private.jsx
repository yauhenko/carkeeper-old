import React, { Component } from 'react';
import {observer} from 'mobx-react';
import Sidebar from "../Sidebar/Sidebar";

@observer
class Private extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            <Sidebar/>
          </div>
          <div className="col-9">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Private;