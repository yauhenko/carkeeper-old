import { observable, action} from 'mobx';
import Api from "../modules/Api";

class News {
  @observable list = [];

  @action getList = async () => {
    this.list = await Api('news');
    console.log(this.list)
  }
}

export default new News();