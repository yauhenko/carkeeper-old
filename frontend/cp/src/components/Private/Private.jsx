import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import Sidebar from "../Sidebar/Sidebar";
import {Redirect} from "react-router-dom";

@inject('app')
@observer
class Private extends Component {
  render() {
    if(!this.props.app.auth) return <Redirect to={"/login"}/>;

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