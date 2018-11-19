import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {observer} from 'mobx-react';
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Private from "./components/Private/Private";

@observer
class App extends Component {
  render() {
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Private>
              <Route render={(props)=><Home {...props}/>} exact path="/"/>
            </Private>
          </Switch>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
