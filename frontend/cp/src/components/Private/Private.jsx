import React, {Component, Fragment} from 'react';
import {observer, inject} from 'mobx-react';
import {Redirect} from 'react-router-dom';
import Navbar from '../Navbar';

@inject('app')
@observer
class Private extends Component {
	render() {
		if (!this.props.app.auth) return <Redirect to="/login"/>;
		return (
			<Fragment>
				<Navbar history={this.props.history} match={this.props.match} location={this.props.location} />
				<div className="container-fluid">{this.props.children}</div>
			</Fragment>
		);
	}
}

export default Private;
