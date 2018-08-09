import { observable, action} from 'mobx';
import Api from '../modules/Api';
import Notification from "../components/Notification";
import { AsyncStorage } from "react-native";

class User {
  constructor () {
    setInterval(()=>this.ping(), 15000);
  }

  @action checkAuth = async () => {
    let token = (await AsyncStorage.getItem('token')) || null;
    if(!token) return this.ready = true;
    this.token = token;

    this.ping(true).then((auth) => {
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

  @action login = async (tel, password) => {
    this.loading = true;
    return Api('users/login', {tel, password}).then(async (response) => {
      this.loading = false;
      this.profile = response.user;
      this.token = response.token;
      this.auth = true;
      await AsyncStorage.setItem('token', response.token);
    }).catch(Notification);
  };

  @action update = async (data = {}) => {
    Api('users/update', data).then(async (response) => {
      if(data.avatar) {this.profile.avatar = data.avatar}
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

  @action ping = async (silent = false) => {
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