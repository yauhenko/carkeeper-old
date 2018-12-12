import { observable} from 'mobx';
import {Platform} from "react-native";

class App {
  @observable auth = false;
  @observable connect = false;
  @observable platform = Platform.OS;
}

export default new App();