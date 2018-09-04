import { observable, action} from 'mobx';

class App {
  @observable auth = false;
  @observable connect = false;
}

export default new App();