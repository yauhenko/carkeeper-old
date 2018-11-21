import {observable, action} from 'mobx';
import api from '../utils/api';

class Users {

	@observable meta = null;
	@observable data = null;
	@observable refs = null;
	@observable page = 1;

	@action fetchList = async () => {
		const res = await api('admin/users', { page: this.page, limit: 5 });
		this.meta = res.meta;
		this.data = res.data;
		this.refs = res.refs;
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
		this.page = 1;
	}

}

export default new Users();
