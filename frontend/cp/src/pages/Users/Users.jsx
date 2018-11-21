import React, {Component, Fragment} from 'react';
import {observer, inject} from 'mobx-react';
import Modal from 'react-responsive-modal';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import Pager from '../../components/Pager';
import './Users.css';

@inject("users")
@observer
class Users extends Component {

	state = {
		editModalOpen: false
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

	closeEditModal = () => {
		this.setState({ editModalOpen: false });
	};

	update = async (e) => {
		e.preventDefault();
		if(await this.props.users.updateItem({
			name: e.target.name.value,
			email: e.target.email.value,
			tel: e.target.tel.value,
		})) this.closeEditModal();
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
								return (
									<tr key={user.id}>
										<td><span className="badge badge-primary">#{user.id}</span></td>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td>{user.tel}</td>
										<td style={{textAlign: 'right'}}>
											<button className="btn btn-sm btn-primary" onClick={() => this.openEditModal(user.id)}>
												<Icon icon="edit"/>
											</button>
											&nbsp;
											<button className="btn btn-sm btn-danger" onClick={() => this.delete(user.id)}>
												<Icon icon="times"/>
											</button>
										</td>
									</tr>
								)
							})}
							</tbody>
						</table>
						<Pager store={this.props.users}/>
					</Fragment>
				}
				<Modal open={this.state.editModalOpen} onClose={this.closeEditModal} center>
					{user === null ? <Loader text="Загрузка данных учетной записи..."/> :
						<Fragment>
							<form style={{ minWidth: '500px' }} onSubmit={this.update}>
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
								<button type="submit" className="btn btn-success">
									<Icon icon="save"/>
									Сохранить
								</button>
								&nbsp;
								<button type="button" className="btn" onClick={this.closeEditModal}>
									<Icon icon="times"/>
									Закрыть
								</button>
							</form>
						</Fragment>
					}
				</Modal>
			</Fragment>
		);
	}
}

export default Users;
