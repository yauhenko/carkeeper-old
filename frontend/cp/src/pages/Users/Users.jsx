import React, {Component, Fragment} from 'react';
import {observer, inject} from 'mobx-react';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import Pager from "../../components/Pager";
import './Users.css';

@inject("users")
@observer
class Users extends Component {

	componentDidMount() {
		this.props.users.fetchList()
	}

	componentWillUnmount() {
		this.props.users.clear();
	}

	delete = async (id) => {
		if (!window.confirm('Точно?')) return;
		await this.props.users.delete(id);
	};

	render() {
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
			</Fragment>
		);
	}
}

export default Users;
