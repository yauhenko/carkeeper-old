import { observable, action} from 'mobx';
import Api from '../modules/Api';
import Notification from "../components/Notification";
import { AsyncStorage } from "react-native";
import App from "../store/App";

class User {
  constructor () {
    setInterval(()=>this.ping(), 30000);
  }

  @action checkAuth = async () => {
    let token = (await AsyncStorage.getItem('token')) || null;
    if(!token) return this.ready = true;
    this.token = token;
    return await this.ping(true).then((auth) => {
      this.ready = true;
      this.auth = auth;
      if(!auth) this.clean();
    });
  };

  @observable auth = false;
  @observable loading = false;
  @observable profile = {};
  @observable token = null;
  @observable ready = false;

  @action login = (tel, password) => {
    this.loading = true;

    return Api('users/login', {tel, password, ttl: 3600 * 24 * 7, noip: true}).then(response => {
      this.profile = response.user;
      this.token = response.token;
      this.loading = false;
      this.auth = true;
      AsyncStorage.setItem('token', response.token);
      return response;
    }).catch((err) => {
      console.log(err);
      this.loading = false;
    });

  };


  @action update = async (data = {}) => {
    Api('users/update', data).then(async () => {
      if(data.avatar) {this.profile.avatar = data.avatar}
      if(data.name) {this.profile.name = data.name}
      if(data.city) {this.profile.name = data.city}
    }).catch(Notification);
  };

  @action create = async (role, tel, email, password, name) => {
    this.loading = true;
    return Api('users/create', {role, tel, email, password, name}).then((response) => {
      this.profile = response.user || {};
      this.auth = true;
      this.token = response.token;
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      Notification(err)
    });
  };

  @action ping = async (silent = false) => {
    if(!App.connect) return false;
    if(!this.token) return false;
    try {
      this.profile = await Api('auth/ping');
      return true;
    } catch (e) {
      this.clean();
      if(silent) return false;
      Notification(e);
    }
  };

  @action logout = () => {
    //todo httpreq
    Api('auth/logout').catch(Notification);
    this.clean();
  };

  @action clean = () => {
    this.token = null;
    this.auth = false;
    this.profile = {};
    AsyncStorage.removeItem('token');
  };
}

export default new User();