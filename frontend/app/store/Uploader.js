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
      let response = await Api('uploads/upload', obj);
      return response.id
    } catch (e) {
      Notification(e);
    }
  };
}

export default new Uploader();