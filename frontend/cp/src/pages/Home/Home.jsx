import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import "./Home.css";

@inject("app")
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

  componentDidMount() {
    console.log(this.props);
    console.log(this.props.app.auth);
  }

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