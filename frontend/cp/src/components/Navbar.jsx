import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import Icon from "./Icon";

@inject('app')
@observer
class Navbar extends Component {

	btnLogoutClick = () => {
		this.props.app.logout(true)
	};

	render() {
		return (
			<nav className="navbar navbar-light bg-light">
				<Link to="/" className="navbar-brand">Admin</Link>
				<ul className="nav">
					<li className="nav-item">
						<Link to="/" className="nav-link">
							<Icon icon="home"/>
							Home
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/users" className="nav-link">
							<Icon icon="users"/>
							Users
						</Link>
					</li>
					<li className="nav-item">
						<button onClick={this.btnLogoutClick} className="btn btn-link text-danger">
							<Icon icon="power-off" fixed/>
							Logout
						</button>
					</li>
				</ul>
			</nav>
		);
	}
}

export default Navbar;
