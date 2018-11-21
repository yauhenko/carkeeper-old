import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import './Login.css';
import Icon from "../../components/Icon";

@inject('app')
@observer
class Login extends Component {

	state = {
		loading: false
	};

	login = async (e) => {
		if(this.state.loading) return;
		e.preventDefault();
		this.setState({ loading: true });
		try {
			await this.props.app.login(e.target.username.value, e.target.password.value);
			this.props.history.replace('/');
		} catch (e) {
			alert(e.message);
			this.setState({ loading: false });
		}

	};

	render() {
		return (
			<div className="container-fluid">
			<form className="login-form" onSubmit={this.login}>
				{this.test}
				<div className="form-group">
					<label>Tel</label>
					<input disabled={this.state.loading} type="text" required={true} autoFocus={!localStorage.username} defaultValue={localStorage.username || ''} name="username" className="form-control"/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input disabled={this.state.loading} type="password" autoFocus={Boolean(localStorage.username)} required={true} name="password" className="form-control"/>
				</div>
				<button disabled={this.state.loading} type="submit" className="btn btn-primary">
					<Icon icon="sign-in" fixed={true}/>
					Login
				</button>
			</form>
			</div>
		);
	}
}

export default Login;
