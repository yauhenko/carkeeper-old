import { observable, action} from 'mobx';
import Api from '../modules/Api';
import Notification from "../components/Notification";
import { AsyncStorage } from "react-native";
import App from "../store/App";
import Logger from "../modules/Logger";

class User {
  constructor () {
    setInterval(()=>this.ping(), 30000);
  }

  @observable auth = false;
  @observable loading = false;
  @observable token = null;
  @observable ready = false;
  @observable fcm = null;

  @observable profile = {};

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

  /**
   * Авторизация пользователя
   * @param data {object}
   * @returns {Promise<void>}
   */
  @action login = async (data) => {
    this.loading = true;

    try {
      let response = await Api('account/login', {...data, ttl: 3600 * 24 * 7, noip: true, fcm: this.fcm});
      this.token = response.token;
      await AsyncStorage.setItem('token', response.token);
      await this.info();
      this.auth = true;
      Logger.debug("FCM", this.fcm);
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  @action info = async () => {
    return await Api('account/info').then(user=> {this.profile = user});
  };

  @action update = async (data = {}) => {
    Api('account/update', {user: data}).then(async () => {
      if(data.avatar) {this.profile.avatar = data.avatar}
      if(data.name) {this.profile.name = data.name}
      if(data.city) {this.profile.name = data.city}
    }).catch(Notification);
  };

  @action create = async (tel, email, password, name) => {
    this.loading = true;
    const fcm = await AsyncStorage.getItem('fcm');
    return Api('account/register', {user: {tel, email, password, name, fcm}, ttl: 3600 * 24 * 7, noip: true}).then(response => {
      this.token = response.token;
      Api('account/info').then(user=> {this.profile = user; this.auth = true});
    }).catch((err) => {
      Notification(err)
    }).finally(()=>{
      this.loading = false;
    });
  };

  @action ping = async (silent = false) => {
    if(!App.connect) return false;
    if(!this.token) return false;
    try {
      this.profile = await Api('account/info');
      return true;
    } catch (e) {
      this.clean();
      if(silent) return false;
      Notification(e);
    }
  };

  @action logout = () => {
    //todo httpreq
    Api('account/logout').catch(Notification);
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