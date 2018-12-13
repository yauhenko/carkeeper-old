import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/assets/css/template.css";
import Modal from 'react-responsive-modal';
import bg1 from './assets/images/bg.jpg'
import Slider from "react-slick";
import 'font-awesome/css/font-awesome.css'

const BGLIST = [bg1]


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: Boolean(window.location.pathname.match(/privacy/))
    };
  }

  componentDidMount() {
    this.recovery();
  }

  getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  recovery = () => {
    const secret = this.getParameterByName("secret");
    if (!secret) return;

    fetch('https://api.carkeeper.pro/account/recovery/secret', {
      method: 'POST',
      body: JSON.stringify({secret: secret})
    }).then((data) => {
      return data.json();
    })
      .then((data) => {
        if (data.error) {
          alert(data.error.message)
        } else {
          alert("Ok")
        }
      })
      .catch((e) => {
        alert(e)
      })
  };

  render() {
    let bg = BGLIST[Math.floor(Math.random() * (BGLIST.length))]
    var settings = {
      afterChange: current => console.log(current),
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <div><i className='fa fa-angle-right' /></div>,
      prevArrow: <div><i className='fa fa-angle-left' /></div>
    };
    return (
      <div className="app" style={{background: `url(${bg}) no-repeat 0 center / cover`}}>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col">
                <div>lorem2000</div>
                <div className="links">
                  <i className='fa fa-home' />
                  <ul>
                    <li>CarKeeper &copy; 2018</li>
                    <li className="link" onClick={() => {
                      this.setState({modal: true})
                    }}>Privacy Policy
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="slider">
                  <Slider {...settings}>
                    <div>
                      <h3>1</h3>
                    </div>
                    <div>
                      <h3>2</h3>
                    </div>
                    <div>
                      <h3>3</h3>
                    </div>
                    <div>
                      <h3>4</h3>
                    </div>
                    <div>
                      <h3>5</h3>
                    </div>
                    <div>
                      <h3>6</h3>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal classNames={{overlay: "react-modal"}} closeIconSize={20} open={this.state.modal} onClose={() => {
          this.setState({modal: false})
        }} center>
          <h2>Privacy Policy</h2>

          <p>Last Updated: 8/8/2018</p>
          <p>Owner of CarKeeper (“CarKeeper”, “we,” and “us”) respects the privacy of its users (“you”) and has
            developed
            this Privacy Policy to demonstrate its commitment to protecting your privacy. This Privacy Policy
            describes the information we collect, how that information may be used, with whom it may be shared, and
            your choices about such uses and disclosures. We encourage you to read this Privacy Policy carefully when
            using our application or services or transacting business with us. By using our website, application or
            other online services (our “Service”), you are accepting the practices described in this Privacy
            Policy.</p>
          <p>If you have any questions about our privacy practices, please refer to the end of this Privacy Policy for
            information on how to contact us.</p>
          <h2>Information we collect about you</h2>
          <p>In General. We may collect Personal Information, including Sensitive Data, and other information.
            “Personal Information” means individually identifiable information that would allow us to determine the
            actual identity of, and contact, a specific living person. Sensitive Data includes information, comments
            or content (e.g. photographs, video, profile, lifestyle) that you optionally provide that may reveal your
            ethnic origin, nationality, religion and/or sexual orientation. By providing Sensitive Data to us, you
            consent to the collection, use and disclosure of Sensitive Data as permitted by applicable privacy laws.
            By using the Service, you are authorizing us to gather, parse and retain data related to the provision of
            the Service.</p>
          <p>Information you provide. We may collect and store any personal information you provide while using our
            Service or in some other manner. This may include identifying information, such as your name, address,
            email address and telephone number, and, if you transact business with us, financial information. You may
            also provide us photos, a personal description and information about your gender and preferences for
            recommendations, such as search distance, age range and gender.</p>
          <h2>How we use the information we collect</h2>
          <p>In General. We may use information that we collect about you to:</p>
          <ul>
            <li>deliver and improve our products and services, and manage our business;</li>
            <li>manage your account and provide you with customer support;</li>
            <li>enforce or exercise any rights in our Terms of Use;</li>
            <li>perform functions or services as otherwise described to you at the time of collection.</li>
          </ul>
          <h2>With whom we share your information</h2>
          <p>Information Shared with Other Users.When you register as a user of Diets, your Diets profile will be
            viewable by other users of the Service. Other users will be able to view information you have provided to
            us.</p>
          <p>Personal information. We do not share your personal information with others except as indicated in this
            Privacy Policy or when we inform you and give you an opportunity to opt out of having your personal
            information shared.</p>
          <h2>How you can access and correct your information</h2>
          <p>If you have a Diets account, you have the ability to review and update your personal information within
            the Service or by sending us a request.</p>
          <p>We will respond to requests within the time allowed by all applicable privacy laws and will make every
            effort to respond as accurately and completely as possible.</p>
          <h2>How we protect your personal information</h2>
          <p>We take security measures to help safeguard your personal information from unauthorized access and
            disclosure. However, no system can be completely secure. Therefore, although we take steps to secure your
            information, we do not promise, and you should not expect, that your personal information, chats, or other
            communications will always remain secure. Users should also take care with how they handle and disclose
            their personal information and should avoid sending personal information through insecure email.</p>
          <h2>Changes to this Privacy Policy</h2>
          <p>We will occasionally update this Privacy Policy to reflect changes in the law, our data collection and
            use practices, the features of our Service, or advances in technology. You should regularly check for the
            most recent version, which is the version that applies. Your continued use of the Services following the
            posting of changes to this policy will mean you consent to and accept those changes. If you do not consent
            to such changes you can delete your account.</p>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
