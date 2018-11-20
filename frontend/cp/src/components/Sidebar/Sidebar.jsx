import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import Icon from '../Icon';

@inject('app')
@observer
class Sidebar extends Component {

	btnLogoutClick = () => {
		this.props.app.logout(true)
	};

	render() {
		return (
			<div className="sidebar">
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
				</ul>
				<button onClick={this.btnLogoutClick} className="btn btn-sm btn-danger">
					<Icon icon="power-off" fixed/>
					Logout
				</button>
			</div>
		);
	}
}

export default Sidebar;
