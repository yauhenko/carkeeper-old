import React, { Component } from 'react';
import {observer} from 'mobx-react';
import "./Login.css";

@observer
class Login extends Component {
  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col">
              Логин
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Login;