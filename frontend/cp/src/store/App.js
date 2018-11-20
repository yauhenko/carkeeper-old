import { observable, action} from 'mobx';

class App {
  @observable auth;

  constructor() {
    this.auth = false;
  }

  @action login = () => {
    this.auth = true;
  }
}

export default new App();