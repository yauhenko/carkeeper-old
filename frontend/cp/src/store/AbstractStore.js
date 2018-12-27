import {observable, action} from 'mobx';
import api from '../utils/api';

class AbstractStore {

	endpoint = '';

	@observable meta = null;
	@observable data = null;
	@observable refs = null;
	@observable item = null;
	@observable page = 1;

	@action fetchList = async () => {
		try {
			const res = await api(this.endpoint, { page: this.page, limit: 50 });
			this.meta = res.meta;
			this.data = res.data;
			this.refs = res.refs;
			return true;
		} catch (e) {
			alert(e.message);
			return false;
		}
	};

	@action fetchItem = async (id) => {
		try {
			const res = await api(this.endpoint + '/get', {id});
			this.item = res.item;
			return true;
		} catch (e) {
			alert(e.message);
			return false;
		}
	};

	@action createItem = async (data = {}) => {
		this.item = {...this.item, ...data};
		try {
			await api(this.endpoint + '/create', { item: this.item });
			await this.fetchList();
			return true;
		} catch (e) {
			alert(e.message);
			return false;
		}
	};

	@action updateItem = async (data = {}) => {
		this.item = {...this.item, ...data};
		try {
			await api(this.endpoint + '/update', { id: this.item.id, item: this.item });
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
			await api(this.endpoint + '/delete', { id });
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

export default AbstractStore;
