import {ToastAndroid} from "react-native";

export default function (error = "Произошла ошибка") {
  if (typeof error !== "string") {error = JSON.stringify(error)}
  ToastAndroid.show(error, ToastAndroid.SHORT);
}