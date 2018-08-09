import { observable, action} from 'mobx';
import Api from "../modules/Api";
import Url from "../modules/Url";

class Uploader {
  @action get = (id) => {
    return `${Url}/uploads/${id}`
  };

  @action save = async (obj = {}) => {
    let response = await Api('uploads/save', obj);
    return response.id
  };
}

export default new Uploader();