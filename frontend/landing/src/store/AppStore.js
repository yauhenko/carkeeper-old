import { observable} from 'mobx';

class App {
  @observable auth = false;
}

export default new App();
