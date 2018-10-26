import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "../src/assets/css/template.css";
import logo from "../src/assets/images/logo.png";

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="logo">
          <img width={250} src={logo} alt=""/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));