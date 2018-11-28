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
  @observable token = null;
  @observable ready = false;
  @observable fcm = null;

  @observable profile = {
    user: {},
    refs: {}
  };

  /**
   * Регистрация пользователя
   * @param user {object}
   * @returns {Promise<*>}
   */
  @action register = async user => {
    return await Api('account/register', {user: {...user, fcm: this.fcm}, ttl: 3600 * 24 * 7, noip: true});
  };

  /**
   * Авторизация пользователя
   * @param data {object}
   * @returns {Promise<void>}
   */
  @action login = async (data) => {
    try {
      let response = await Api('account/login', {...data, ttl: 3600 * 24 * 7, noip: true, fcm: this.fcm});
      this.token = response.token;
      await AsyncStorage.setItem('token', response.token);
      this.profile = await this.info();
      this.auth = true;
      Logger.debug("FCM", this.fcm);
      return response;
    } catch (e) {
      throw e;
    }
  };

  /**
   * Выход пользователя
   * @returns {Promise<void>}
   */
  @action logout = async () => {
    try {
      await Api('account/logout');
    } catch (e) {/* Скромно молчим */}

    this.token = null;
    this.auth = false;
    this.profile = {};
    AsyncStorage.removeItem('token');
  };

  /**
   * Профиль пользователя
   * @returns {Promise<*>}
   */
  @action info = async () => {
      return await Api('account/info');
  };

  /**
   * Проверка авторизации
   * @returns {Promise<void>}
   */
  @action checkAuth = async () => {
    this.token = (await AsyncStorage.getItem('token')) || null;

    if(this.token) {
      try {
        this.profile = await this.info();
        this.auth = true;
      } catch (e) {
        AsyncStorage.removeItem('token');
        Notification(e);
      }
    }

    this.ready = true;
  };

  /**
   * Обновление профиля пользователя
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action update = async (data = {}) => {
    return await Api('account/update', data);
  };


  /**
   * Восстановление пароля пользователя
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action recovery = async (data = {}) => {
    return await Api('account/recovery', {...data, ttl: 3600 * 24 * 7, noip: true, fcm: this.fcm});
  };


  /**
   * Отправка сообщения в поддержку
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action feedback = async (data = {}) => {
    return await Api('feedback', data);
  };

  /**
   * Пинг
   * @param silent
   * @returns {Promise<*>}
   */
  @action ping = async (silent = false) => {
    if(!App.connect) return false;
    if(!this.token) return false;
    try {
      return await Api('account/ping');
    } catch (e) {
      if(silent) return false;
      Notification(e);
    }
  };

}

export default new User();