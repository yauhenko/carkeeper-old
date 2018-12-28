import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observer, Provider} from 'mobx-react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Wrapper from "./components/Wrapper";

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/theme.css';

const stores = {

};

@observer
class App extends Component {
  render() {
    return (
      <div className="app">
        <Provider {...stores}>
          <Router>
            <Switch>
              <Wrapper>
                <Route exact path="/" component={()=><div>1</div>}/>
                <Route exact path="/card" component={()=><div>2</div>}/>
              </Wrapper>
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));