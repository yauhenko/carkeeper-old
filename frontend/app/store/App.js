import { observable, action} from 'mobx';

class App {
  @observable auth = false;
}

export default new App();