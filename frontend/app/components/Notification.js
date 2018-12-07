import {Platform, ToastAndroid} from "react-native";
import {Toast} from 'native-base';

export default function Notification (message = "Произошла ошибка") {
  if (typeof message !== "string") {message = JSON.stringify(message)}
  if(Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Toast.show({text: message, duration: 2000})
  }
}