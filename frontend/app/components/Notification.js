import {ToastAndroid} from "react-native";

export default function (error) {
  ToastAndroid.show(error, ToastAndroid.SHORT);
  throw error;
}