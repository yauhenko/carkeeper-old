import React, {Component, Fragment} from 'react';
import {observer} from 'mobx-react';
import Modal from 'react-responsive-modal';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import Pager from '../../components/Pager';
import store from '../../store/Maintenance';
import {plural} from "../../utils/tools";

@observer
class Maintenance extends Component {

	state = {
		editModalOpen: false,
	};

	componentDidMount() {
		store.fetchList();
	}

	componentWillUnmount() {
		store.clearStore();
	}

	openEditModal = (id) => {
		store.item = null;
		store.fetchItem(id);
		this.setState({ editModalOpen: true });
	};

	closeEditModal = () => {
		this.setState({ editModalOpen: false });
	};

	create = () => {
		store.item = {};
		this.setState({ editModalOpen: true });
	};

	update = async (e) => {
		e.preventDefault();
		const item = {
			name: e.target.name.value,
			distance: e.target.distance.value || null,
			period: e.target.period.value || null,
			period_type: e.target.period_type.value,
			fuel: e.target.fuel.value || null,
			transmission: e.target.transmission.value || null,
		};
		if(store.item.id) {
			if(await store.updateItem(item)) this.closeEditModal();
		} else {
			if(await store.createItem(item)) this.closeEditModal();
		}
	};

	delete = async (id) => {
		if (!window.confirm('Точно?')) return;
		await store.deleteItem(id);
	};

	render() {
		return (
			<Fragment>
				{store.data === null ? <Loader text="Получаем список работ..."/> :
					<Fragment>
						<table className="table table-striped">
							<thead>
							<tr>
								<th>Id</th>
								<th>Название</th>
								<th>Пробег</th>
								<th>Интервал</th>
								<th>Фильтры</th>
								<th style={{textAlign:'right'}}>
									<button className="btn btn-sm btn-success" onClick={this.create}>
										<Icon icon="plus-circle"/>
										Создать
									</button>
								</th>
							</tr>
							</thead>
							<tbody>
							{store.data.map((item) => {
								return (
									<tr key={item.id}>
										<td><span className="badge badge-primary">#{item.id}</span></td>
										<td>{item.name}</td>
										<td>{item.distance ? `${item.distance} km` : <Fragment>&mdash;</Fragment> }</td>
										<td>{item.period ? `${item.period} ${item.period_type}` : <Fragment>&mdash;</Fragment> }</td>
										<td>
											<span className="badge badge-info">Топливо: {item.fuel || 'Любое'}</span>
											&nbsp;
											<span className="badge badge-info">Коробка: {item.transmission || 'Любая'}</span>
										</td>
										<td style={{textAlign: 'right'}}>
											<div className="btn-group">
												<button className="btn btn-sm btn-primary" onClick={() => this.openEditModal(item.id)}>
													<Icon icon="edit"/>
												</button>
												<button className="btn btn-sm btn-danger" onClick={() => this.delete(item.id)}>
													<Icon icon="times"/>
												</button>
											</div>
										</td>
									</tr>
								)
							})}
							</tbody>
						</table>
						<Pager store={store}/>
					</Fragment>
				}
				<Modal styles={{modal:{padding:'0',borderRadius:'5px'}}} open={this.state.editModalOpen} onClose={this.closeEditModal} showCloseIcon={false}>
					{store.item === null ? <Loader text="Загрузка..."/> :
						<Fragment>
							<form className="card" style={{ minWidth: '600px' }} onSubmit={this.update}>
								<div className="card-body">
									<div className="form-group">
										<label>Название работы</label>
										<textarea rows="2" name="name" required defaultValue={store.item.name} className="form-control" />
									</div>
									<div className="row">
										<div className="col-6">
											<div className="form-group">
												<label>Пробег</label>
												<div className="input-group">
													<input type="number" min="0" step="1" name="distance" defaultValue={store.item.tel} className="form-control" />
													<span className="input-group-append">
														<span className="input-group-text">км.</span>
													</span>
												</div>
											</div>
										</div>
										<div className="col-6">
											<label>Интервал</label>
											<div className="input-group">
												<input ref="period" type="number" name="period" min="0" step="1" onChange={(e)=>store.item.period=e.target.value} defaultValue={store.item.period} className="form-control w-50" />
												<select name="period_type" defaultValue={store.item.period_type} className="form-control w-50">
													<option value="month">{plural(Number(store.item.period || 1), 'месяц,,а,ев')}</option>
													<option value="year">{plural(Number(store.item.period || 1), ',год,года,лет')}</option>
												</select>
											</div>

										</div>
									</div>

									<div className="row">
										<div className="col-6">
											<div className="form-group">
												<label>Топливо</label>
												<select name="fuel" defaultValue={store.item.fuel} className="form-control">
													<option value="">Любое</option>
													<option value="gasoline">Бензин</option>
													<option value="diesel">Дизель</option>
												</select>
											</div>
										</div>
										<div className="col-6">
											<div className="form-group">
												<label>Трансмиссия</label>
												<select name="transmission" defaultValue={store.item.transmission} className="form-control">
													<option value="">Любая</option>
													<option value="manual">Ручная</option>
													<option value="automatic">Автоматическая</option>
												</select>
											</div>
										</div>
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

export default Maintenance;
