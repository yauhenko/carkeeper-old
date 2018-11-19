import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";

@observer
class Home extends Component {
  @observable value;

  constructor() {
    super();
    this.value = 0;
  }

  @action inc = () => {
    this.value++;
  };

  render() {
    return (
      <div className="home">
        <span>{this.value}</span>
        <button onClick={this.inc}>+</button>
      </div>
    );
  }
}

export default Home;