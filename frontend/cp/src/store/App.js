import { observable, action} from 'mobx';

class App {
  @observable auth;

  constructor() {
    this.auth = false;
  }


}

export default new App();