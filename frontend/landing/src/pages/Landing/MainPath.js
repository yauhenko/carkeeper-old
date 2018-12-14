import React from 'react';
import {Checkbox} from 'antd'
import ios from '../../assets/images/app_store.png'
import android from '../../assets/images/google_play.png'
import {observer} from 'mobx-react'

@observer
 class MainPath extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phone: '+375 '
    }
  }

  render() {
    return (
      <div className='main_path'>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className='main_path_slogan'>CarKeeper – это автомобильный сервис,</h1>
              <h4 className='main_path_slogan_2'>который содержит множество полезных функций,
                призванных сделать использование вашего автомобиля максимально комфортным.
              </h4>
            </div>
          </div>
          {/*<form action="" className='main_path_phone_form'>*/}
            {/*<div className="row">*/}
              {/*<div className="col-12">*/}
                {/*<div className='text-center main_path_form-text'><span*/}
                  {/*className='bold'>Пройдите регистрацию на сайте</span></div>*/}
              {/*</div>*/}
              {/*<div className="col-12 col-sm-12 col-md-6 ">*/}
                {/*<div className='main_path_phone-wrap'>*/}
                  {/*<label>*/}
                    {/*<div><span >Введите Ваш номер телефона</span></div>*/}
                    {/*<input type="text" defaultValue={this.state.phone} className='main_path_phone-input  custom_input accent_shadow'/>*/}
                  {/*</label>*/}
                {/*</div>*/}
              {/*</div>*/}
              {/*<div className="col-12 col-sm-12 col-md-6 align-self-end">*/}
                {/*<button className='main_path_phone-button custom_button bold accent_shadow'>Далее</button>*/}
              {/*</div>*/}

            {/*</div>*/}
          {/*</form>*/}
          {/*<div className="row">*/}
            {/*<div className="col">*/}
              {/*<div className="main_path_policy">*/}
                {/*<Checkbox options={{backgroundColor: 'red'}}/>*/}
                {/*<div className='main_path_policy-text'>*/}
                  {/*<span>Принимаю условия </span>*/}
                  {/*<span className='main_path_agrement-link'>Пользовательского соглашения</span>*/}
                  {/*<span> и даю свое согласие на обработку персональной информации на условиях, определенных </span>*/}
                  {/*<span className='main_path_policy-link'>Политикой конфиденциальности</span>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
          <div className="row text-center mb_download">
            <div className="col">
              <span className='bold'>Cкачайте наше мобильное приложение:</span>
            </div>
          </div>
          <div className="row main_path_shops">
            <div className="col-6">
              <div className="main_path_shops-ios">
                <a href="http://itunes.apple.com/app/id1445116921" target='_blank'>
                <img src={ios} alt="App_Store"/>
                </a>
              </div>
            </div>
            <div className="col-6">
              <div className="main_path_shops-android">
                <a href="http://play.google.com/store/apps/details?id=by.carkeeper" target='_blank'>
                <img src={android} alt="Play_Market"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MainPath
