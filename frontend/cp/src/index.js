import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {observer, Provider} from 'mobx-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Private from './components/Private/Private';
import NotFound from './pages/NotFound/NotFound';
import AppStore from './store/App';
import UsersStore from './store/Users';
import Loader from './components/Loader';
import Users from './pages/Users/Users';
import './styles.css';

const stores = {
	app: AppStore,
	users: UsersStore,
};

@observer
class App extends Component {
	render() {
		return (
			<div className="app">
				{AppStore.auth === null ? <Loader text="Проверка учетной записи..."/> :
					<Provider {...stores}>
						<Router>
							<Switch>
								<Route exact path="/login" component={Login}/>
								<Route render={(props) => <Private {...props}><Home {...props}/></Private>} exact path="/"/>
								<Route render={(props) => <Private {...props}><Users {...props}/></Private>} exact path="/users"/>
								<Route component={NotFound}/>
							</Switch>
						</Router>
					</Provider>
				}
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));
