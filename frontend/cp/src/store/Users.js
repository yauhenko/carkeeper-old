import {observable, action} from 'mobx';
import api from '../utils/api';

class Users {

	@observable meta = null;
	@observable data = null;
	@observable refs = null;
	@observable item = null;
	@observable page = 1;

	@action fetchList = async () => {
		const res = await api('admin/users', { page: this.page, limit: 5 });
		this.meta = res.meta;
		this.data = res.data;
		this.refs = res.refs;
	};

	@action fetchItem = async (id) => {
		const res = await api('admin/users/get', { id });
		this.item = res.user;
	};

	@action updateItem = async (data = {}) => {
		this.item = {...this.item, ... data};
		try {
			await api('admin/users/update', { id: this.item.id, user: this.item });
			await this.fetchList();
			return true;
		} catch (e) {
			alert(e.message);
			return false;
		}
	};

	@action setPage = async (page) => {
		this.page = page;
		await this.fetchList()
	};

	@action delete = async (id, reload = true) => {
		try {
			await api('admin/users/delete', { id });
			if(reload) await this.fetchList()
		} catch (e) {
			alert(e.message);
		}
	};

	@action clear = () => {
		this.meta = null;
		this.data = null;
		this.refs = null;
		this.item = null;
		this.page = 1;
	}

}

export default new Users();
