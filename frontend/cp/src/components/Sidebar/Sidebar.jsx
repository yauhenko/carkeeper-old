import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {observer, inject} from 'mobx-react';

@inject('app')
@observer
class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/hui">404</Link>
          </li>
        </ul>
		  <button onClick={() => this.props.app.logout(true)}>Logout</button>
      </div>
    );
  }
}

export default Sidebar;
