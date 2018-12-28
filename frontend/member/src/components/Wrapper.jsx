import React, {Component, Fragment} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import Header from "./Header";

@observer
class Wrapper extends Component {
  render() {
    return (
      <Fragment>

        <Header/>

        <div className="container">
          <div className="row">
            <div className="col-3">
              <Sidebar/>
            </div>
            <div className="col">
              <div className="content">{this.props.children}</div>
            </div>
          </div>
        </div>

      </Fragment>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default Wrapper;