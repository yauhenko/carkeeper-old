import User from "../store/User";
import Url from "../modules/Url";
import Notification from "../components/Notification";
import Logger from "./Logger";
import {AsyncStorage} from "react-native";

export default async (path, params = {}) => {
    console.log({["request: " + path]: params});

    let result = await fetch( Url + "/" +path, {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      mode: "cors",
      body: JSON.stringify(Object.assign(params, {token: User.token}))
    });

    let data = await result.json();

  console.log({["response: " + path]: data});


  if (data.error) {
      if(data.error.code === 403) {User.logout()}
      const error = data.error.message || data.error.sql || "Внутренняя ошибка";
      Notification(error);
      Logger.error("Ошибка от сервера", data.error);
      throw error;
    }

    console.log({["response: " + path]: data.result});
    return data.result;
}