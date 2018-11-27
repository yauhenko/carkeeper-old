import React, {Component, Fragment} from 'react';
import {observer, inject} from 'mobx-react';
import Modal from 'react-responsive-modal';

import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import Pager from '../../components/Pager';
import api from '../../utils/api';

import './News.css';
import Image from "../../components/Image";

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
		this.props.news.item = {content:[]};
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

	addElement(element) {
		element.id = Math.random();
		this.props.news.item.content.push(element);
	}

	deleteElement(idx) {
		this.props.news.item.content.splice(idx, 1);
		this.forceUpdate();
	}

	moveElement(idxFrom, idxTo) {
		const itemFrom = Object.assign({}, this.props.news.item.content[idxFrom]);
		const itemTo = Object.assign({}, this.props.news.item.content[idxTo]);
		this.props.news.item.content[idxFrom] = itemTo;
		this.props.news.item.content[idxTo] = itemFrom;
	}

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
				<Modal styles={{modal:{padding:'0',borderRadius:'5px', width: '1200px', maxWidth:'1200px'}}} open={this.state.editModalOpen} onClose={this.closeEditModal} showCloseIcon={false}>
					{news === null || this.channels === null ? <Loader text="Загрузка данных новости..."/> :
						<Fragment>

							<form className="card" onSubmit={this.update}>

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
													{this.channels.map((ch)=>{return <option key={ch.id} value={ch.id}>{ch.name}</option>})}
												</select>
											</div>
										</div>
										<div className="col-3">
											<div className="form-group">
												<label>Дата публикации</label>
												<input type="date" name="date_begin" required={true} defaultValue={news.date_begin || (new Date()).toISOString().substr(0,10)} className="form-control" />
											</div>
										</div>
										<div className="col-3">
											<div className="form-group">
												<label>Скрыть публикацию</label>
												<input type="date" name="date_end" defaultValue={news.date_end} className="form-control" />
											</div>
										</div>
									</div>

									<div className="form-group">
										<label>Контент</label>
										<div className="form-group">
											<button type="button" className="btn btn-sm" onClick={()=>this.addElement({ type: 'h', text: '', screen: 'inner'})}>
												<Icon icon="header"/>
											</button>
											&nbsp;
											<button type="button" className="btn btn-sm" onClick={()=>this.addElement({ type: 'p', text: '', screen: 'inner'})}>
												<Icon icon="paragraph"/>
											</button>
											&nbsp;
											<button type="button" className="btn btn-sm" onClick={()=>this.addElement({ type: 'img', src: '', screen: 'inner'})}>
												<Icon icon="picture-o"/>
											</button>
											&nbsp;
											<button type="button" className="btn btn-sm" onClick={()=>this.addElement({ type: 'a', href: '', screen: 'inner'})}>
												<Icon icon="link"/>
											</button>

										</div>

										<div>
											{news.content.map((e, idx) => {
												if(e === null) return null;
												return <div key={e.id || Math.random()} className="row form-group">
													<div className="col-1">
														<span className="badge badge-info">{{
															p: 'Текст',
															h: 'Заголовок',
															img: 'Картинка',
															a: 'Ссылка'
														}[e.type]}</span>
													</div>
													<div className="col-8">
														{e.type === 'p' ? <textarea className="form-control" required={true} defaultValue={e.text} onChange={(e)=>this.props.news.item.content[idx].text=e.target.value} placeholder="Текст"/> : null }
														{e.type === 'img' ?
															<div className="input-group">
																<input ref={`image-${e.id}`} type="url" className="form-control" required={true} defaultValue={e.src} onChange={(e)=>this.props.news.item.content[idx].src=e.target.value} placeholder="http://domain.com/img.jpg" />
																<Image onUpload={(res)=>this.refs[`image-${e.id}`].value=this.props.news.item.content[idx].src=res.url}/>
															</div>
														: null }
														{e.type === 'a' ?
															<div className="row">
																<div className="col-6">
																	<input type="url" className="form-control" required={true} defaultValue={e.href} onChange={(e)=>this.props.news.item.content[idx].href=e.target.value} placeholder="http://domain.com/page.html" />
																</div>
																<div className="col-6">
																	<input type="text" className="form-control" defaultValue={e.text} onChange={(e)=>this.props.news.item.content[idx].text=e.target.value} placeholder="Текст ссылки" />
																</div>
															</div>
														: null }
														{e.type === 'h' ?
															<div className="row">
																<div className="col-2">
																	<select className="form-control" defaultValue={e.size || 2} onChange={(e)=>this.props.news.item.content[idx].size=e.target.value}>
																		<option value={1}>H1</option>
																		<option value={2}>H2</option>
																		<option value={3}>H3</option>
																		<option value={4}>H4</option>
																	</select>
																</div>
																<div className="col-10">
																	<input type="text" className="form-control" defaultValue={e.text} onChange={(e)=>this.props.news.item.content[idx].text=e.target.value} placeholder="Заголовок" />
																</div>
															</div>
															: null }
													</div>
													<div className="col-3" style={{textAlign: 'right'}}>
														<select className="form-control float-left w-50" defaultValue={e.screen} onChange={(e)=>this.props.news.item.content[idx].screen=e.target.value}>
															<option value="main">Главная</option>
															<option value="inner">Внутр.</option>
															<option value="any">Везде</option>
														</select>
														<div className="btn-group float-right">
															<button disabled={idx >= news.content.length - 1} type="button" className="btn btn-primary btn-sm" onClick={()=>this.moveElement(idx, idx + 1)}>
																<Icon icon="arrow-down"/>
															</button>
															<button disabled={!idx} type="button" className="btn btn-primary btn-sm" onClick={()=>this.moveElement(idx, idx - 1)}>
																<Icon icon="arrow-up"/>
															</button>
															<button type="button" className="btn btn-danger btn-sm" onClick={()=>this.deleteElement(idx)}>
																<Icon icon="times"/>
															</button>
														</div>
													</div>


												</div>
											})}
										</div>


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
