import { observable, action} from 'mobx';
import Api from '../modules/Api';
import Notification from "../components/Notification";

class User {
  constructor() {
    setInterval(()=>this.ping(), 15000);
  }

  @observable auth = false;
  @observable loading = false;
  @observable profile = {};
  @observable token = null;


  @action login = (tel, password) => {
    this.loading = true;
    Api('users/login', {tel, password}).then((response)=>{
      this.loading = false;
      this.auth = true;
      this.profile = response.user;
      this.token = response.token;
      console.log(response)
    }).catch(Notification);
  };


  @action create = async (role, tel, email, password) => {
    this.loading = true;
    return Api('users/create', {role, tel, email, password}).then((response) => {
      this.profile = response.user || {};
      this.token = response.token;
      this.loading = false;
    }).catch(Notification);
  };

  @action ping = async () => {
    if(!this.token) return;
    Api('auth/ping', {}).then((response) => {
      console.log(response);
      this.profile = response;
    }).catch(Notification);
  };

  @action logout = () => {

  };
}

export default new User();