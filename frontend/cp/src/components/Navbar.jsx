import React, {Component} from 'react';
import {NavLink, Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import Icon from './Icon';

@inject('app')
@observer
class Navbar extends Component {

	btnLogoutClick = () => {
		this.props.app.logout(true)
	};

	render() {
		return (
			<nav className="navbar navbar-light bg-light">
				<Link to="/" className="navbar-brand">CarKeeper</Link>
				<ul className="nav">
					<li className="nav-item">
						<NavLink to="/" className="nav-link" exact={true}>
							<Icon icon="home"/>
							Дом
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/stats" className="nav-link" exact={true}>
							<Icon icon="bar-chart"/>
							Статистика
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/news" className="nav-link">
							<Icon icon="list"/>
							Новости
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/maintenance" className="nav-link">
							<Icon icon="wrench"/>
							Обслуживание
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/users" className="nav-link">
							<Icon icon="users"/>
							Пользователи
						</NavLink>
					</li>
					<li className="nav-item">
						<button onClick={this.btnLogoutClick} className="btn btn-link text-danger">
							<Icon icon="sign-out" fixed/>
						</button>
					</li>
				</ul>
			</nav>
		);
	}
}

export default Navbar;
