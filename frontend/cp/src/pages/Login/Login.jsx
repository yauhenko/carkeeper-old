import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import './Login.css';

@inject('app')
@observer
class Login extends Component {

	login = async (e) => {
		e.preventDefault();
		try {
			await this.props.app.login(e.target.username.value, e.target.password.value);
			this.props.history.replace('/');
		} catch (e) {
			alert(e.message);
		}
	};

	render() {
		return (
			<form onSubmit={this.login} style={{margin:'20px', maxWidth: '500px'}}>
				<div className="form-group">
					<label>Tel</label>
					<input type="text" required={true} autoFocus={!localStorage.username} defaultValue={localStorage.username || ''} name="username" className="form-control"/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input type="password" autoFocus={Boolean(localStorage.username)} required={true} name="password" className="form-control"/>
				</div>
				<button type="submit" className="btn btn-primary">Login</button>
			</form>
		);
	}
}

export default Login;
