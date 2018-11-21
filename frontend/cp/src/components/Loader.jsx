import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

class Loader extends Component {

	static defaultProps = {
		icon: 'spinner',
		spin: true,
		text: 'Загрузка...',
		fixed: true
	};

	static propTypes = {
		icon: PropTypes.string.isRequired,
		spin: PropTypes.bool,
		text: PropTypes.string
	};

	render() {
		return (
			<div className="loader" style={{padding:'3px 5px', color: 'gray'}}>
				<Icon {...this.props}/>
				{this.props.text}
			</div>
		);
	}
}

export default Loader;
