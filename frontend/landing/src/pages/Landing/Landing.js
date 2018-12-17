import React from 'react';
import '../../assets/css/landing.css'
import Slider from "./Slider";
import Header from "./Header";
import MainPath from "./MainPath";
import Footer from "./Footer";
import ModalWrap from "./ModalWrap";
import {observer} from 'mobx-react'
import ModalWrapNext from "./ModalWrapNext";

@observer
class Landing extends React.Component {
  render() {
    return (
      <div className="app" >


        <div className="content">
          <Header/>
          <MainPath/>
          <Slider/>
          <Footer/>
          <ModalWrapNext/>
          <ModalWrap/>
        </div>

      </div>
    );
  }
}

export default Landing
