import React, {Component, Fragment} from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Modal from "react-responsive-modal";
import Icon from "./Icon";
import api, {cdn} from "../utils/api";
import PropTypes from "prop-types";

class Image extends Component {

	static propTypes = {
		onUpload: PropTypes.func.isRequired
	};

	state = {
		url: null,
		dataUrl: null,
		modalOpen: false
	};

	filename = null;

	closeModal = () => {
		this.setState({ modalOpen: false });
	};

	openModal = () => {
		this.setState({ modalOpen: true });
	};

	selectFile = (event) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			this.setState({ dataUrl: event.target.result })
		};
		const file = event.target.files[0];
		console.log(file);
		reader.readAsDataURL(file);
		this.filename = file.name;
	};

	upload = async () => {
		const data = this.refs.cropper.getCroppedCanvas().toDataURL().split(',')[1];
		let res = await api('uploads/upload', { data, name: this.filename });
		this.closeModal();
		res.url = cdn + res.path;
		this.props.onUpload(res);
	};

	render() {
		return (
			<Fragment>
				<button type="button" className="btn btn-sm" onClick={this.openModal}>...</button>
				<Modal open={this.state.modalOpen} onClose={this.closeModal}>
					<div className="form-group">
						<input className="form-control" type="file" onChange={this.selectFile}/>
					</div>
					{this.state.dataUrl ?
						<Fragment>
						<Cropper ref="cropper" src={this.state.dataUrl} guides={true}
								 aspectRatio={1} style={{height: 400, width: 500}} />
						<hr/>
						<button type="button" className="btn btn-success" onClick={this.upload}>
							<Icon icon="save"/>
							Сохранить
						</button>
						&nbsp;
						<button type="button" className="btn" onClick={this.closeModal}>
							<Icon icon="times"/>
							Закрыть
						</button>
						</Fragment>
					: null}

				</Modal>
			</Fragment>
		);
	}
}

export default Image;
