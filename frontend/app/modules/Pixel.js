import {AsyncStorage} from "react-native";
import Api from "./Api";

class Pixel {
  pixel = null;
  first = true;

  constructor() {
    this.initial();
  }

  request = async () => {
    try {
      const response = await Api("stats/launch", {
        pixel: this.pixel,
        first: this.first
      });

      await AsyncStorage.setItem("first", "1");

      if(response) {
        this.pixel = response.pixel;
        await AsyncStorage.setItem("pixel", response.pixel);
      }
    } catch (e) {
    }
  };

  initial = async () => {
    try {
      this.first = !Boolean(await AsyncStorage.getItem("first", ()=>{}));
      this.pixel = await AsyncStorage.getItem("pixel", ()=>{});
      await this.request()
    } catch (e) {
    }
  }

}

export default new Pixel();
