import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {observer} from 'mobx-react';

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
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/hui">404</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;