import React from 'react';
import {observer} from 'mobx-react'
import LandingStore from "../../store/LandingStore";

@observer
 class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className='footer'>
        <div className="container">
          <div className="row">
            <div className="col">
                <span onClick={()=> LandingStore.modal_privacy = true}>Политика конфиденциальности</span>
                <span  onClick={()=> LandingStore.modal_terms = true}>Условия пользовательского соглашения</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Footer
