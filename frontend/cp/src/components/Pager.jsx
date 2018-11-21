import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {range} from "../utils/tools";

class Pager extends Component {

	static propTypes = {
		store: PropTypes.object.isRequired,
	};

	render() {
		return (
			this.props.store.meta.pages > 1 &&
			<nav>
				<ul className="pagination">
					{range(this.props.store.meta.pages).map((page) => {
						return (
							<li key={page} className={`page-item ${this.props.store.meta.page === page ? 'active' : null}`}>
								<button className="page-link" onClick={()=>{this.props.store.setPage(page)}}>{page}</button>
							</li>
						)
					})}
				</ul>
			</nav>
		);
	}
}

export default Pager;
