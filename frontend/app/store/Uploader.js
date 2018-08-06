import { observable, action} from 'mobx';
import Api from "../modules/Api";

class Uploader {
  @action get = (id) => {
    return "http://192.168.1.20:8000/uploads/" + id
  };

  @action save = async (obj = {}) => {
    let response = await Api('uploads/save', obj);
    console.log(response);
    return response.id
  };
}

export default new Uploader();