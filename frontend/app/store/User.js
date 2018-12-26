import { observable, action} from 'mobx';
import Api from '../modules/Api';
import Notification from "../components/Notification";
import { AsyncStorage } from "react-native";
import App from "../store/App";

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
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action register = async (data = {}) => {
    return await Api('account/register', data);
  };

  /**
   * Авторизация пользователя
   * @param data {object}
   * @returns {Promise<void>}
   */
  @action login = async (data = {}) => {
    return await Api('account/login', {...data, ttl: 3600 * 24 * 30, noip: true, fcm: this.fcm});
  };

  /**
   * Выход пользователя
   * @returns {Promise<void>}
   */
  @action logout = async (ignore = false) => {
    if(!ignore) {
      try {
        await Api('account/logout');
      } catch (e) {/* Скромно молчим */}
    }

    this.token = null;
    this.auth = false;
    this.profile = {};

    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('password');
  };


  /**
   * Отправить код верификации на телефон
   * @param data {object}
   * @returns {Promise<void>}
   */
  @action tel = async (data = {}) => {
    return await Api('account/tel', data);
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
   * Восстановление доступа по SMS
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action recoverySMS = async (data = {}) => {
    return await Api('account/recovery/tel', {...data, ttl: 3600 * 24 * 7, noip: true, fcm: this.fcm});
  };


  /**
   * Проверка кода СМС
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action verify = async (data = {}) => {
    return await Api('account/tel/verify', data);
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
   * Получить инфу по гео
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action getGeo = async (data = {}) => {
    return await Api('account/geo', data);
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
      return await Api('account/ping', {fcm: this.fcm});
    } catch (e) {
      if(silent) return false;
      Notification(e);
    }
  };

}

export default new User();