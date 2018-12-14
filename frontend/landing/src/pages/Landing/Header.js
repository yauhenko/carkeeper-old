import React from 'react';
import logo from '../../assets/images/logo.png'
import {observer} from 'mobx-react'
import LandingStore from "../../store/LandingStore";

@observer
class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className='header'>
        <div className="container">
          <div className="row">
            <div className="col-12 header-left">
              <div className="header-left_logo">
                <img src={logo} alt="logo"/>
                <span className='header-left_defis'></span>
                <span>Органайзер водителя</span>
              </div>

            </div>
            {/*<div className="col-2 header-right">*/}
              {/*<span className='bold header_sighIn' onClick={()=> LandingStore.modal_signIn = true}>Вход</span>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    );
  }
}
export default Header
