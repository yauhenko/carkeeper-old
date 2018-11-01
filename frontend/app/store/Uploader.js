import {action} from 'mobx';
import Api from "../modules/Api";
import Url from "../modules/Url";
import Notification from "../components/Notification";

class Uploader {
  @action get = (id) => {
    return `${Url}/uploads/${id}`
  };

  @action save = async (obj = {}) => {
    try {
      return await Api('uploads/upload', obj);
    } catch (e) {
      Notification(e);
    }
  };
}

export default new Uploader();