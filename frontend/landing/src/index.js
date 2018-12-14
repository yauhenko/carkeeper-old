import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.css'
import "./assets/css/template.css";
import "./assets/css/media.css";
import Landing from "./pages/Landing/Landing";
import {observer} from 'mobx-react'

@observer
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.recovery();
  }

  getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  recovery = () => {
    const secret = this.getParameterByName("secret");
    if (!secret) return;

    fetch('https://api.carkeeper.pro/account/recovery/secret', {
      method: 'POST',
      body: JSON.stringify({secret: secret})
    }).then((data) => {
      return data.json();
    })
      .then((data) => {
        if (data.error) {
          alert(data.error.message)
        } else {
          alert("Ok")
        }
      })
      .catch((e) => {
        alert(e)
      })
  };

  render() {

    return (
      <Landing/>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
