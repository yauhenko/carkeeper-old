import { observable, action} from 'mobx';
import Api from '../modules/Api';

class App {
  @observable auth = false;
}

export default new App();