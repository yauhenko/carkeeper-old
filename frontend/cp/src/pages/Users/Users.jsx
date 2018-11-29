import React, {Component, Fragment} from 'react';
import {observer, inject} from 'mobx-react';
import Modal from 'react-responsive-modal';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import Pager from '../../components/Pager';
import {formToObject} from '../../utils/tools';
import api from '../../utils/api';

import './Users.css';

@inject("users")
@observer
class Users extends Component {

	state = {
		fcm: null,
		pushModalOpen: false,
		editModalOpen: false,
	};

	componentDidMount() {
		this.props.users.fetchList()
	}

	componentWillUnmount() {
		this.props.users.clear();
	}

	openEditModal = (id) => {
		this.props.users.item = null;
		this.props.users.fetchItem(id);
		this.setState({ editModalOpen: true });
	};

	closePushModal = () => {
		this.setState({ pushModalOpen: false });
	};

	closeEditModal = () => {
		this.setState({ editModalOpen: false });
	};

	openPushModal = (fcm) => {
		this.setState({ fcm, pushModalOpen: true });
	};

	sendPush = async (e) => {
		e.preventDefault();
		try {
			const form = e.target;
			const res = await api('admin/users/push', { fcm: this.state.fcm, ...formToObject(form), extra: JSON.parse(form.extra.value) });
			console.log(res);
			form.reset();
			this.closePushModal();
		} catch (e) {
			console.error(e);
			alert(e.message);
		}
	};

	update = async (e) => {
		e.preventDefault();
		if(await this.props.users.updateItem(formToObject(e.target))) this.closeEditModal();
	};

	delete = async (id) => {
		if (!window.confirm('Точно?')) return;
		await this.props.users.delete(id);
	};

	render() {
		const user = this.props.users.item;
		return (
			<Fragment>
				{this.props.users.data === null ? <Loader text="Получаем список пользователей..."/> :
					<Fragment>
						<table className="table table-striped">
							<thead>
							<tr>
								<th>Id</th>
								<th>Имя</th>
								<th>E-mail</th>
								<th>Телефон</th>
								<th/>
							</tr>
							</thead>
							<tbody>
							{this.props.users.data.map((user) => {
								const admin = [1, 3].indexOf(user.id) > -1;
								return (
									<tr key={user.id} className={admin ? 'text-danger' : null}>
										<td><span className="badge badge-primary">#{user.id}</span></td>
										<td>
											<Icon icon="user"/>
											{user.name}
										</td>
										<td>{user.email}</td>
										<td>{user.tel}</td>
										<td style={{textAlign: 'right'}}>
											<div className="btn-group">
												<button disabled={!user.fcm} className="btn btn-sm btn-warning" onClick={() => this.openPushModal(user.fcm)}>
													<Icon icon="envelope"/>
												</button>
												<button className="btn btn-sm btn-primary" onClick={() => this.openEditModal(user.id)}>
													<Icon icon="edit"/>
												</button>
												<button  disabled={admin} className="btn btn-sm btn-danger" onClick={() => this.delete(user.id)}>
													<Icon icon="times"/>
												</button>
											</div>
										</td>
									</tr>
								)
							})}
							</tbody>
						</table>
						<Pager store={this.props.users}/>
					</Fragment>
				}
				<Modal styles={{modal:{padding:'0',borderRadius:'5px'}}} open={this.state.editModalOpen} onClose={this.closeEditModal} showCloseIcon={false}>
					{user === null ? <Loader text="Загрузка данных учетной записи..."/> :
						<Fragment>
							<form className="card" style={{ minWidth: '500px' }} onSubmit={this.update}>
								<div className="card-body">
									<div className="form-group">
										<label>Имя</label>
										<input type="text" name="name" required defaultValue={user.name} className="form-control" />
									</div>
									<div className="form-group">
										<label>Телефон</label>
										<input type="tel" name="tel" required defaultValue={user.tel} className="form-control" />
									</div>
									<div className="form-group">
										<label>E-mail</label>
										<input type="email" name="email" required defaultValue={user.email} className="form-control" />
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
				<Modal styles={{modal:{padding:'0',borderRadius:'5px'}}} open={this.state.pushModalOpen} onClose={this.closePushModal} >
					<form className="card" style={{ minWidth: '500px' }} onSubmit={this.sendPush}>
						<div className="card-body">
							<div className="form-group">
								<label>Заголовок</label>
								<input type="text" name="title" required defaultValue="CarKeeper" className="form-control" />
							</div>
							<div className="form-group">
								<label>Сообщение</label>
								<input type="text" name="body" required defaultValue="" className="form-control" />
							</div>
							<div className="form-group">
								<label>Extra (JSON)</label>
								<textarea name="extra" defaultValue="{}" className="form-control" />
							</div>
						</div>
						<div className="card-footer">
							<button type="submit" className="btn btn-success">
								<Icon icon="check"/>
								Отправить
							</button>
							&nbsp;
							<button type="button" className="btn" onClick={this.closePushModal}>
								<Icon icon="times"/>
								Закрыть
							</button>
						</div>
					</form>
				</Modal>
			</Fragment>
		);
	}
}

export default Users;
