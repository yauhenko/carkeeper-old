import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {observer, Provider} from 'mobx-react';
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Private from "./components/Private/Private";
import NotFound from "./pages/NotFound/NotFound";

import AppStore from "./store/App";

const stores = {
  app: AppStore
};

@observer
class App extends Component {
  render() {
    return (
      <div className="app">
        <Provider {...stores}>
          <Router>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route render={(props)=><Private {...props}><Home {...props}/></Private>} exact path="/"/>
              <Route component={NotFound}/>
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
