import { observable} from 'mobx';
import {Platform} from "react-native";

class App {
  @observable auth = false;
  @observable connect = false;
  @observable platform = Platform.OS;
  @observable ready = false;
}

export default new App();