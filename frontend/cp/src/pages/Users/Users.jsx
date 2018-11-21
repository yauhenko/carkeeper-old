import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import './Users.css';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import {range} from '../../utils/tools';

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
		if(!window.confirm('Точно?')) return;
		await this.props.users.delete(id);
	};

	render() {
		return (
			<div className="users">

				{this.props.users.data === null ?
					<Loader text="Получаем список пользователей..."/>
				:

					<div>
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
									<button className="btn btn-sm btn-danger" onClick={()=>this.delete(user.id)}>
										<Icon icon="times"/>
									</button>
								</td>
							</tr>
						)
					})}
					</tbody>
					</table>

					{this.props.users.meta.pages > 1 &&
						<nav>
							<ul className="pagination">
							{range(this.props.users.meta.pages).map((page) => {
								return (
									<li key={page} className={`page-item ${this.props.users.meta.page === page ? 'active' : null}`}>
										<button className="page-link" onClick={()=>{this.props.users.setPage(page)}}>{page}</button>
									</li>
								)
							})}
							</ul>
						</nav>
					}

					</div>



				}

			</div>
		);
	}
}

export default Users;
