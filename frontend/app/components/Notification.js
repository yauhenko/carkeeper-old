import {ToastAndroid} from "react-native";

export default function Notification (message = "Произошла ошибка") {
  if (typeof message !== "string") {message = JSON.stringify(message)}
  ToastAndroid.show(message, ToastAndroid.SHORT);
}