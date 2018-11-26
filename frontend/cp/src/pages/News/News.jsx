import React, {Component, Fragment} from 'react';
import {observer, inject} from 'mobx-react';
import Modal from 'react-responsive-modal';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import Pager from '../../components/Pager';
import api from '../../utils/api';

import './News.css';

@inject("news")
@observer
class Users extends Component {

	channels = null;

	state = {
		editModalOpen: false
	};

	async componentDidMount() {
		await this.props.news.fetchList();
		this.channels = (await api('admin/news/channels')).channels;
	}

	componentWillUnmount() {
		this.props.news.clear();
	}

	create = () => {
		this.props.news.item = {};
		this.setState({ editModalOpen: true });
	};

	openEditModal = (id) => {
		this.props.news.item = null;
		this.props.news.fetchItem(id);
		this.setState({ editModalOpen: true });
	};

	closeEditModal = () => {
		this.setState({ editModalOpen: false });
	};

	update = async (e) => {
		e.preventDefault();

		let item = {
			title: e.target.title.value,
			channel: e.target.channel.value,
			date_begin: e.target.date_begin.value || null,
			date_end: e.target.date_end.value || null,
			content: e.target.content.value,
			published: e.target.published.checked,
			pinned: e.target.pinned.checked,
		};

		if(this.props.news.item.id) {
			if(await this.props.news.updateItem(item)) this.closeEditModal();
		} else {
			if(await this.props.news.createItem(item)) this.closeEditModal();
		}

	};

	delete = async (id) => {
		if (!window.confirm('Точно?')) return;
		await this.props.news.delete(id);
	};


	render() {
		const news = this.props.news.item;
		return (
			<Fragment>
				{this.props.news.data === null ? <Loader text="Получаем список новостей..."/> :
					<Fragment>
						<table className="table table-striped">
							<thead>
							<tr>
								<th>Id</th>
								<th>Заголовок</th>
								<th>Публикация</th>
								<th>Флаги</th>
								<th style={{textAlign:'right'}}>
									<button className="btn btn-sm btn-success" onClick={this.create}>
										<Icon icon="plus-circle"/>
										Создать
									</button>
								</th>
							</tr>
							</thead>
							<tbody>
							{this.props.news.data.map((item) => {
								return (
									<tr key={item.id}>
										<td><span className="badge badge-primary">#{item.id}</span></td>
										<td>{item.title}</td>
										<td>{item.date_begin || '∞'} ... {item.date_end || '∞'}</td>
										<td>
											{item.published ? <span className="badge badge-success"><Icon icon="globe"/> Опубликовано</span> : null}
											&nbsp;
											{item.pinned ? <span className="badge badge-danger"><Icon icon="thumb-tack" fixed={false}/> Закреп</span> : null}
										</td>
										<td style={{textAlign: 'right'}}>
											<button className="btn btn-sm btn-primary" onClick={() => this.openEditModal(item.id)}>
												<Icon icon="edit"/>
											</button>
											&nbsp;
											<button className="btn btn-sm btn-danger" onClick={() => this.delete(item.id)}>
												<Icon icon="times"/>
											</button>
										</td>
									</tr>
								)
							})}
							</tbody>
						</table>
						<Pager store={this.props.news}/>
					</Fragment>
				}
				<Modal styles={{modal:{padding:'0',borderRadius:'5px'}}} open={this.state.editModalOpen} onClose={this.closeEditModal} showCloseIcon={false}>
					{news === null || this.channels === null ? <Loader text="Загрузка данных новости..."/> :
						<Fragment>

							<form className="card" style={{ minWidth: '800px' }} onSubmit={this.update}>

								<div className="card-body">

									<div className="form-group">
										<label>Заголовок</label>
										<input type="text" name="title" required defaultValue={news.title} className="form-control" />
									</div>

									<div className="row">
										<div className="col-6">
											<div className="form-group">
												<label>Канал</label>
												<select name="channel" required defaultValue={news.channel} className="form-control">
													{this.channels.map((ch) => { return <option key={ch.id} value={ch.id}>{ch.name}</option>})}
												</select>
											</div>
										</div>
										<div className="col-3">
											<div className="form-group">
												<label>Начало</label>
												<input type="date" name="date_begin" defaultValue={news.date_begin} className="form-control" />
											</div>
										</div>
										<div className="col-3">
											<div className="form-group">
												<label>Конец</label>
												<input type="date" name="date_end" defaultValue={news.date_end} className="form-control" />
											</div>
										</div>
									</div>

									<div className="form-group">
										<label>Контент</label>
										<textarea name="content"  defaultValue={news.content} className="form-control" rows={10}/>
									</div>

									<div>
										<label>
											<input type="checkbox" name="published" defaultChecked={news.published}/>
											&nbsp; Опубликовать
										</label>
										<label style={{marginLeft:'20px'}}>
											<input type="checkbox" name="pinned" defaultChecked={news.pinned}/>
											&nbsp; Закрепить
										</label>
									</div>

								</div>
								<div className="card-footer">

									<button type="submit" className="btn btn-success">
										<Icon icon="save"/>
										Сохранить
									</button>
									&nbsp;
									<button type="button" className="btn" onClick={this.closeEditModal}>
										<Icon icon="times"/>
										Закрыть
									</button>
								</div>
							</form>
						</Fragment>
					}
				</Modal>
			</Fragment>
		);
	}
}

export default Users;
