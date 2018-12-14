import React from 'react';
import Slider from "react-slick";
import ic_1 from '../../assets/images/ic_1.png'
import ic_2 from '../../assets/images/ic_2.png'
import ic_3 from '../../assets/images/ic_3.png'
import ic_4 from '../../assets/images/ic_4.png'
import prev from '../../assets/images/prev.png'
import next from '../../assets/images/next.png'
import mac_1 from '../../assets/images/mac_1.png'
import mac_2 from '../../assets/images/mac_2.png'
import mac_3 from '../../assets/images/mac_2.png'
import mac_4 from '../../assets/images/mac_2.png'
import iphone_1 from '../../assets/images/iphone_1.png'
import iphone_2 from '../../assets/images/iphone_2.png'
import iphone_3 from '../../assets/images/iphone_2.png'
import iphone_4 from '../../assets/images/iphone_2.png'
import iphone_small_1 from '../../assets/images/1.png'
import iphone_small_2 from '../../assets/images/2.png'
import iphone_small_3 from '../../assets/images/3.png'
import iphone_small_4 from '../../assets/images/4.png'
import {observer} from 'mobx-react'


function SampleNextArrow(props) {
  const {   onClick } = props;
  return (
    <div className='slider-arrows slider-arrows-next d-none d-lg-block' onClick={onClick}>
      <img src={next} alt="arrow"/>
    </div>
  );
}

function SamplePrevArrow(props) {
  const {   onClick } = props;
  return (
    <div className='slider-arrows slider-arrows-prev d-none d-lg-block' onClick={onClick}>
      <img src={prev} alt="arrow"/>
    </div>
  );
}

@observer
 class SliderComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  changeSlide = (id) => {
    this.setState({current: id})
    this.slider.slickGoTo(id)
  }

  render() {
    const {current} = this.state
    const settings = {
      afterChange: current => this.setState({current}),
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };
    return (
      <div className="sec_tasks">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className='sec_tasks-title'><span className='bold'>CarKeeper позволит решить следующие задачи:</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className={` col-6 col-sm-2 col-md-3 sec_tasks_item sec_tasks_item-1 text-center align-self-end ${current === 0 ? 'sec_tasks_item-active' : ''} `}>
              <div className='d-inline-block' onClick={()=>this.changeSlide(0)}>
                <div className="sec_tasks_item_image"><img src={ic_1} alt="Экономия"/></div>
                <div className="sec_tasks_item_text bold">Экономия</div>
              </div>
            </div>
            <div className={`col-6 col-sm-3 sec_tasks_item sec_tasks_item-2 text-center align-self-end ${current === 1 ? 'sec_tasks_item-active' : ''}`}>
              <div className='d-inline-block' onClick={()=>this.changeSlide(1)}>
                <div className="sec_tasks_item_image"><img src={ic_2} alt="Удобство"/></div>
                <div className="sec_tasks_item_text bold">Удобство</div>
              </div>
            </div>
            <div className={`col-6 col-sm-3 sec_tasks_item sec_tasks_item-3 text-center align-self-end ${current === 2 ? 'sec_tasks_item-active' : ''}`}>
              <div className='d-inline-block' onClick={()=>this.changeSlide(2)}>
                <div className="sec_tasks_item_image"><img src={ic_3} alt="Информативность"/></div>
                <div className="sec_tasks_item_text bold">Информативность</div>
              </div>
            </div>
            <div className={`col-6 col-sm-4 col-md-3 sec_tasks_item sec_tasks_item-5 text-center align-self-end ${current === 3 ? 'sec_tasks_item-active' : ''}`}>
              <div className='d-inline-block' onClick={()=>this.changeSlide(3)}>
                <div className="sec_tasks_item_image"><img src={ic_4} alt="Всегда под рукой"/></div>
                <div className="sec_tasks_item_text bold">Всегда под рукой</div>
              </div>
            </div>
          </div>
        </div>
        <div className="slider">
          <div className="container">
            <div className="row">
              <div className="col">
                <Slider ref={slider => (this.slider = slider)} {...settings}>
                  <div className='slider_item'>
                    <div className="slider_item-text">
                      <p><span className='bold'>Автоматические уведомления о штрафах</span> с камер фиксации помогут избежать процентов за несвоевременную оплату. Страховой случай не наступит именно в тот момент, когда истекла страховка, <span className='bold'>благодаря актуальным напоминаниям.</span> Контроль за систематическим проведением мероприятий по обслуживанию автомобиля позволит избежать серьезных поломок и, как следствие, его дорогостоящего ремонта. </p>
                    </div>
                    <div className="slider_item_images d-lg-block">
                      <div className='slider_item_images-mac-shadow'></div>
                      <div className='slider_item_images-mac'>
                        <img src={mac_1} alt="mac"/>
                      </div>
                      <img src={iphone_1} alt="iphone" className='slider_item_images-iphone'/>
                    </div>
                    <div className="slider_item_images-small d-lg-none">
                      <img src={iphone_small_1} alt="iphone"/>
                    </div>
                  </div>
                  <div className='slider_item'>
                    <div className="slider_item-text">
                      <p>Вся необходимая информация об автомобиле находится в одном месте.
                        Больше не нужно держать ее в голове.
                        <span className='bold'> Возможность вести журнал</span> обо всех ремонтных работах, заменах запчастей и их моделях позволит предоставить вашему автомеханику полезную информацию для диагностики. Продуманная навигация позволит найти любую информацию за пару кликов.</p>
                    </div>
                    <div className="slider_item_images d-lg-block">
                      <div className='slider_item_images-mac-shadow'></div>
                      <div className='slider_item_images-mac'>
                        <img src={mac_2} alt="mac"/>
                      </div>
                      <img src={iphone_2} alt="iphone" className='slider_item_images-iphone'/>
                    </div>
                    <div className="slider_item_images-small d-lg-none">
                      <img src={iphone_small_2} alt="iphone"/>
                    </div>
                  </div>
                  <div className='slider_item'>
                    <div className="slider_item-text">
                      <p><span className='bold'>Готовый список рекомендаций по обслуживанию автомобиля</span> упростит жизнь водителю со стажем и станет отправной точкой знакомства с автомобилем для новичка.
                        <span className='bold'> Собственные заметки</span> со всей важной информацией сделают сервис идеальным персонально для вас.</p>
                    </div>
                    <div className="slider_item_images d-lg-block">
                      <div className='slider_item_images-mac-shadow'></div>
                      <div className='slider_item_images-mac'>
                        <img src={mac_3} alt="mac"/>
                      </div>
                      <img src={iphone_3} alt="iphone" className='slider_item_images-iphone'/>
                    </div>
                    <div className="slider_item_images-small d-lg-none">
                      <img src={iphone_small_3} alt="iphone"/>
                    </div>
                  </div>
                  <div className='slider_item'>
                    <div className="slider_item-text">
                      <p>Сервис доступен не только в веб-версии, но и в виде<span className='bold'> мобильного приложения.</span> Это гарантирует, что информация об автомобиле будет с вами всегда, когда с вами ваш мобильный телефон. </p>
                    </div>
                    <div className="slider_item_images d-lg-block">
                      <div className='slider_item_images-mac-shadow'></div>
                      <div className='slider_item_images-mac'>
                        <img src={mac_4} alt="mac"/>
                      </div>
                      <img src={iphone_4} alt="iphone" className='slider_item_images-iphone'/>
                    </div>
                    <div className="slider_item_images-small d-lg-none">
                      <img src={iphone_small_4} alt="iphone"/>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SliderComponent
