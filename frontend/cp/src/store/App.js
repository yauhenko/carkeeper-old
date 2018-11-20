import {observable, action} from 'mobx';
import api from '../utils/api';

class App {

	@observable auth = false;
	pingInterval = null;

	constructor() {
		if(localStorage.token) this.startPing(true);
	}

	@action login = async (tel, password, ttl = 3600, noip = false) => {
		const res = await api('account/login', { tel, password, ttl, noip });
		localStorage.token = res.token;
		localStorage.username = tel;
		this.auth = true;
		this.startPing();
	};

	@action logout = async (remote = true) => {
		if(remote) await api('account/logout', {}, true);
		delete localStorage.username;
		delete localStorage.token;
		this.auth = false;
		clearInterval(this.pingInterval);
	};

	@action ping = async () => {
		const res = await api('account/ping', {}, true);
		if(res) return res;
		this.logout(false);
		return false;
	};

	startPing = async (check = false) => {
		if(check) {
			if(!await this.ping()) return false;
		}
		this.pingInterval = setInterval(this.ping, 10000);
	}

}

export default new App();
