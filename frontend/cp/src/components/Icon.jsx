import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Icon extends Component {

	static defaultProps = {
		fixed: true,
		spin: false,
		flip: null,
		zoom: null,
		rotate: null,
		extra: ''
	};

	static propTypes = {
		icon: PropTypes.string.isRequired,
		fixed: PropTypes.bool,
		spin: PropTypes.bool,
		flip: PropTypes.oneOf(['horizontal', 'vertical']),
		rotate: PropTypes.oneOf(['90', '180', '270']),
		zoom: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
		extra: PropTypes.string
	};

	render() {
		let style = 'fa fa-' + (this.props.icon);
		if(this.props.fixed) style += ' fa-fw';
		if(this.props.spin) style += ' fa-spin';
		if(this.props.zoom) style += ' fa-' + this.props.zoom;
		if(this.props.flip) style += ' fa-flip-' + this.props.flip;
		if(this.props.rotate) style += ' fa-rotate-' + this.props.rotate;
		if(this.props.extra) style += ' ' + this.props.extra;
		return (<i className={style}/>);
	}
}

export default Icon;
