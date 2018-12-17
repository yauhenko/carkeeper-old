import { observable} from 'mobx';

class LandingStore {
  @observable  modal_privacy = Boolean(window.location.pathname.match(/privacy/))
  @observable  modal_terms = Boolean(window.location.pathname.match(/terms/))
  @observable  modal_signIn = false

}

export default new LandingStore();
